package com.bolobill.app.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.bolobill.app.data.model.Invoice
import com.bolobill.app.util.WhatsAppHelper

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun UdhaarKhataScreen(
    invoiceList: List<Invoice>,
    shopName: String,
    shopUpi: String,
    onBack: () -> Unit,
    onMarkSettled: (Invoice) -> Unit
) {
    val context = LocalContext.current
    val pendingList = remember(invoiceList) {
        invoiceList.filter { !it.isPaid && (it.totalAmount > 0) }
    }
    val totalMarketUdhaar = pendingList.sumOf { it.totalAmount }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("उधार खाता बही (Customer Khata)", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Market Outstanding Total Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFFEF2F2)),
                border = BorderStroke(1.dp, Color(0xFFFCA5A5))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("कुल बाजार उधार (Total Outstanding)", style = MaterialTheme.typography.labelMedium, color = Color(0xFF991B1B))
                    Text(
                        "₹${String.format("%.2f", totalMarketUdhaar)}",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.ExtraBold,
                        color = Color(0xFFDC2626)
                    )
                    Text("लंबित ग्राहक: ${pendingList.size}", style = MaterialTheme.typography.bodySmall, color = Color(0xFF7F1D1D))
                }
            }

            Text("बकाया ग्राहकों की सूची", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleSmall)

            if (pendingList.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("कोई उधार बाकी नहीं है! सब हिसाब चुकता है। 🎉", color = Color(0xFF16A34A), fontWeight = FontWeight.Medium)
                }
            } else {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(pendingList) { inv ->
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
                        ) {
                            Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column {
                                        Text(inv.clientName.ifEmpty { "अज्ञात ग्राहक" }, fontWeight = FontWeight.Bold)
                                        Text(inv.clientPhone, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.outline)
                                    }
                                    Text(
                                        "₹${String.format("%.2f", inv.totalAmount)}",
                                        fontWeight = FontWeight.Bold,
                                        style = MaterialTheme.typography.titleMedium,
                                        color = Color(0xFFDC2626)
                                    )
                                }

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    OutlinedButton(
                                        onClick = {
                                            WhatsAppHelper.sendPaymentReminder(
                                                context = context,
                                                clientPhone = inv.clientPhone,
                                                clientName = inv.clientName,
                                                balanceDue = inv.totalAmount,
                                                shopName = shopName,
                                                upiId = shopUpi
                                            )
                                        },
                                        modifier = Modifier.weight(1f),
                                        shape = RoundedCornerShape(8.dp)
                                    ) {
                                        Icon(Icons.Default.Send, contentDescription = null, modifier = Modifier.size(16.dp))
                                        Spacer(Modifier.width(4.dp))
                                        Text("तकाज़ा भेजें")
                                    }

                                    Button(
                                        onClick = { onMarkSettled(inv) },
                                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF16A34A)),
                                        modifier = Modifier.weight(1f),
                                        shape = RoundedCornerShape(8.dp)
                                    ) {
                                        Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                                        Spacer(Modifier.width(4.dp))
                                        Text("वसूल हुआ")
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
