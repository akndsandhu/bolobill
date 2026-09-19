package com.bolobill.app.util

import android.content.Context
import android.content.Intent
import androidx.core.content.FileProvider
import com.bolobill.app.data.model.Invoice
import java.io.File
import java.io.FileOutputStream
import java.text.SimpleDateFormat
import java.util.*

object ExcelExportHelper {

    fun exportInvoicesToCsv(context: Context, invoices: List<Invoice>): File? {
        return try {
            val dir = File(context.cacheDir, "reports").apply { if (!exists()) mkdirs() }
            val csvFile = File(dir, "BoloBill_Report_${System.currentTimeMillis()}.csv")
            val output = FileOutputStream(csvFile)

            // UTF-8 BOM for Excel Hindi compatibility
            output.write(byteArrayOf(0xEF.toByte(), 0xBB.toByte(), 0xBF.toByte()))

            // Headers
            val header = "Invoice No,Date,Customer Name,Phone,Type,Subtotal,GST Amount,Grand Total,Advance,Balance Due,Status,Rating\n"
            output.write(header.toByteArray())

            val dateFormat = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())

            invoices.forEach { inv ->
                val type = if (inv.isEstimate) "कोटेशन" else if (inv.isGstInvoice) "GST बिल" else "पक्का बिल"
                val dateStr = dateFormat.format(Date(inv.createdAt))
                val status = if (inv.isPaid) "Paid" else "Pending"
                val line = "${inv.invoiceNumber},$dateStr,\"${inv.clientName}\",${inv.clientPhone},$type,${inv.subtotal},${inv.gstAmount},${inv.subtotal + inv.gstAmount},${inv.advanceAmount},${inv.totalAmount},$status,${inv.customerRating} Stars\n"
                output.write(line.toByteArray())
            }

            output.flush()
            output.close()
            csvFile
        } catch (e: Exception) {
            null
        }
    }

    fun shareCsvToWhatsApp(context: Context, file: File) {
        val uri = FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", file)
        val intent = Intent(Intent.ACTION_SEND).apply {
            type = "text/csv"
            putExtra(Intent.EXTRA_STREAM, uri)
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }
        context.startActivity(Intent.createChooser(intent, "CA / एकाउंटेंट को रिपोर्ट भेजें"))
    }
}
