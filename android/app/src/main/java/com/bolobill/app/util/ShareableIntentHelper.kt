package com.bolobill.app.util

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.widget.Toast
import androidx.core.content.FileProvider
import com.bolobill.app.data.model.Invoice
import java.io.File
import java.util.Locale

object ShareableIntentHelper {
    private const val FILE_PROVIDER_AUTHORITY_SUFFIX = ".fileprovider"
    const val PACKAGE_WHATSAPP = "com.whatsapp"
    const val PACKAGE_WHATSAPP_BUSINESS = "com.whatsapp.w4b"

    fun buildWhatsAppMessage(clientName: String, amount: Double, isPaid: Boolean): String {
        val formattedAmount = String.format(Locale.ROOT, "%.0f", amount)
        return if (isPaid) {
            "नमस्ते $clientName जी, आपके काम का कुल भुगतान ₹$formattedAmount प्राप्त हो गया है। रसीद संलग्न है। धन्यवाद!"
        } else {
            "नमस्ते $clientName जी, आपके काम का बिल ₹$formattedAmount है। कृपया संलग्न PDF में दिए गए UPI QR कोड से भुगतान करें। धन्यवाद!"
        }
    }

    fun getFileProviderUri(context: Context, pdfFile: File): Uri {
        require(pdfFile.exists()) { "Invoice PDF file does not exist: ${pdfFile.absolutePath}" }
        val authority = "${context.packageName}$FILE_PROVIDER_AUTHORITY_SUFFIX"
        return FileProvider.getUriForFile(context, authority, pdfFile)
    }

    fun getInstalledWhatsAppPackage(context: Context): String? {
        val pm = context.packageManager
        return try {
            pm.getPackageInfo(PACKAGE_WHATSAPP, PackageManager.GET_ACTIVITIES)
            PACKAGE_WHATSAPP
        } catch (_: PackageManager.NameNotFoundException) {
            try {
                pm.getPackageInfo(PACKAGE_WHATSAPP_BUSINESS, PackageManager.GET_ACTIVITIES)
                PACKAGE_WHATSAPP_BUSINESS
            } catch (_: PackageManager.NameNotFoundException) {
                null
            }
        }
    }

    fun shareInvoiceViaWhatsApp(
        context: Context,
        invoice: Invoice,
        isPaid: Boolean,
        pdfFile: File
    ) {
        val messageText = buildWhatsAppMessage(invoice.clientName, invoice.totalAmount, isPaid)
        val contentUri = getFileProviderUri(context, pdfFile)
        val targetPackage = getInstalledWhatsAppPackage(context)
        val sendIntent = Intent(Intent.ACTION_SEND).apply {
            type = "application/pdf"
            putExtra(Intent.EXTRA_STREAM, contentUri)
            putExtra(Intent.EXTRA_TEXT, messageText)
            putExtra(Intent.EXTRA_SUBJECT, "Invoice #${invoice.invoiceNumber} - ${invoice.technicianName}")
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            if (targetPackage != null) {
                setPackage(targetPackage)
            }
        }
        try {
            context.startActivity(sendIntent)
        } catch (e: Exception) {
            val chooserIntent = Intent(Intent.ACTION_SEND).apply {
                type = "application/pdf"
                putExtra(Intent.EXTRA_STREAM, contentUri)
                putExtra(Intent.EXTRA_TEXT, messageText)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            context.startActivity(Intent.createChooser(chooserIntent, "Share Invoice via..."))
        }
    }

    fun openPdfInExternalViewer(context: Context, pdfFile: File) {
        try {
            val contentUri = getFileProviderUri(context, pdfFile)
            val viewIntent = Intent(Intent.ACTION_VIEW).apply {
                setDataAndType(contentUri, "application/pdf")
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            context.startActivity(viewIntent)
        } catch (e: Exception) {
            Toast.makeText(context, "No PDF viewer application found on device", Toast.LENGTH_SHORT).show()
        }
    }

    fun copyMessageToClipboard(context: Context, message: String) {
        val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        val clip = ClipData.newPlainText("BoloBill WhatsApp Message", message)
        clipboard.setPrimaryClip(clip)
        Toast.makeText(context, "Message copied to clipboard", Toast.LENGTH_SHORT).show()
    }
}
