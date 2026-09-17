package com.bolobill.app.ui.screens

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.core.content.FileProvider
import com.bolobill.app.data.model.Invoice
import com.bolobill.app.pdf.PdfGenerator
import com.bolobill.app.util.ShareableIntentHelper
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File

/**
 * PdfPreviewScreen: Review, toggle Instant Receipt (Mark as Paid), and Share via WhatsApp.
 *
 * CRITICAL FEATURES:
 * 1. 1-Tap "Mark as Paid" receipt toggle:
 *    - Updates invoice state and generates clearance stamp.
 *    - Triggers canvas diagonal semi-transparent watermark.
 * 2. Dynamic WhatsApp message generation:
 *    - If Unpaid: "नमस्ते [Name], आपका बिल ₹[Amount] तैयार है। कृपया UPI QR कोड स्कैन करके भुगतान करें। धन्यवाद!"
 *    - If Paid: "नमस्ते [Name], आपका भुगतान ₹[Amount] सफलतापूर्वक प्राप्त हो गया है। रसीद संलग्न है।"
 * 3. Zero broad permissions:
 *    - Shares PDF via Android FileProvider (FLAG_GRANT_READ_URI_PERMISSION).
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PdfPreviewScreen(
    invoice: Invoice,
    onInvoiceUpdated: (Invoice) -> Unit,
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var isPaidState by remember { mutableStateOf(invoice.isPaid) }
    var generatedPdfFile by remember { mutableStateOf<File?>(null) }
    var isRenderingPdf by remember { mutableStateOf(true) }

    LaunchedEffect(isPaidState) {
        isRenderingPdf = true
        coroutineScope.launch {
            val updatedInvoice = invoice.copy(
                isPaid = isPaidState,
                paidDate = if (isPaidState) (invoice.paidDate ?: System.currentTimeMillis()) else null
            )
            val pdfFile = PdfGenerator.generateInvoicePdf(context, updatedInvoice)
            withContext(Dispatchers.Main) {
                generatedPdfFile = pdfFile
                isRenderingPdf = false
                onInvoiceUpdated(updatedInvoice)
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (isPaidState) "Payment Receipt (रसीद)" else "Invoice Preview") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        },
        bottomBar = {
            Surface(tonalElevation = 8.dp, modifier = Modifier.fillMaxWidth()) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Button(
                        onClick = {
                            if (generatedPdfFile != null) {
                                dispatchWhatsAppIntent(context, invoice, isPaidState, generatedPdfFile!!)
                            } else {
                                Toast.makeText(context, "Rendering PDF, please wait...", Toast.LENGTH_SHORT).show()
                            }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF25D366))
                    ) {
                        Icon(Icons.Default.Share, contentDescription = "Share", tint = Color.White)
                        Spacer(Modifier.width(8.dp))
                        Text(
                            text = if (isPaidState) "WhatsApp Payment Receipt" else "WhatsApp Invoice & UPI",
                            color = Color.White,
                            style = MaterialTheme.typography.titleSmall
                        )
                    }
                }
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(
                    containerColor = if (isPaidState) Color(0xFFF0FDF4) else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                )
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        Icon(
                            imageVector = if (isPaidState) Icons.Default.CheckCircle else Icons.Default.Pending,
                            contentDescription = null,
                            tint = if (isPaidState) Color(0xFF16A34A) else MaterialTheme.colorScheme.outline
                        )
                        Column {
                            Text(
                                text = if (isPaidState) "Marked as Paid (भुगतान प्राप्त)" else "Payment Pending (बाकी)",
                                style = MaterialTheme.typography.titleMedium,
                                color = if (isPaidState) Color(0xFF166534) else MaterialTheme.colorScheme.onSurface
                            )
                            Text(
                                text = if (isPaidState) "Switches to green watermark & removes UPI QR" else "Shows UPI QR code for scanning",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.outline
                            )
                        }
                    }

                    Switch(
                        checked = isPaidState,
                        onCheckedChange = { isPaidState = it },
                        thumbContent = if (isPaidState) {
                            { Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(14.dp)) }
                        } else null
                    )
                }
            }

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFE7FCE8))
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Chat, contentDescription = null, tint = Color(0xFF128C7E), modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(6.dp))
                        Text("WhatsApp Message Preview:", style = MaterialTheme.typography.labelMedium, color = Color(0xFF128C7E))
                    }
                    val msg = getWhatsAppMessage(invoice.clientName, invoice.totalAmount, isPaidState)
                    Text(text = msg, style = MaterialTheme.typography.bodyMedium, color = Color(0xFF1F2937))
                }
            }

            if (isRenderingPdf) {
                Box(modifier = Modifier.fillMaxWidth().weight(1f), contentAlignment = Alignment.Center) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        CircularProgressIndicator()
                        Spacer(Modifier.height(12.dp))
                        Text("Generating compliant A4 Canvas PDF...")
                    }
                }
            } else {
                Card(
                    modifier = Modifier.fillMaxWidth().weight(1f),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Column(
                        modifier = Modifier.fillMaxSize().padding(16.dp),
                        verticalArrangement = Arrangement.Center,
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(Icons.Default.CheckCircleOutline, contentDescription = null, tint = Color(0xFF16A34A), modifier = Modifier.size(48.dp))
                        Spacer(Modifier.height(8.dp))
                        Text("A4 PDF Rendered Successfully", style = MaterialTheme.typography.titleMedium)
                        Text(
                            text = "Saved in Scoped Storage: ${generatedPdfFile?.name}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.outline
                        )
                        Spacer(Modifier.height(14.dp))
                        Button(onClick = {
                            openPdfExternalViewer(context, generatedPdfFile)
                        }) {
                            Icon(Icons.Default.Visibility, contentDescription = "View")
                            Spacer(Modifier.width(6.dp))
                            Text("Open in PDF Viewer")
                        }
                    }
                }
            }
        }
    }
}

fun getWhatsAppMessage(clientName: String, amount: Double, isPaid: Boolean): String {
    val formattedAmount = String.format(java.util.Locale.ROOT, "%.0f", amount)
    return if (isPaid) {
        "नमस्ते $clientName जी, आपके काम का कुल भुगतान ₹$formattedAmount प्राप्त हो गया है। रसीद संलग्न है। धन्यवाद!"
    } else {
        "नमस्ते $clientName जी, आपके काम का बिल ₹$formattedAmount है। कृपया संलग्न PDF में दिए गए UPI QR कोड से भुगतान करें। धन्यवाद!"
    }
}

fun dispatchWhatsAppIntent(context: Context, invoice: Invoice, isPaid: Boolean, pdfFile: File) {
    ShareableIntentHelper.shareInvoiceViaWhatsApp(context, invoice, isPaid, pdfFile)
}

fun openPdfExternalViewer(context: Context, pdfFile: File?) {
    if (pdfFile == null) return
    ShareableIntentHelper.openPdfInExternalViewer(context, pdfFile)
}
