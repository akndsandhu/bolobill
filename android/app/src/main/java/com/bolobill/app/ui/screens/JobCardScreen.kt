package com.bolobill.app.ui.screens

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.bolobill.app.data.model.JobCard
import java.net.URLEncoder

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun JobCardScreen(
    shopName: String,
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val jobCards = remember { mutableStateListOf<JobCard>() }
    var showAddDialog by remember { mutableStateOf(false) }

    var custName by remember { mutableStateOf("") }
    var custPhone by remember { mutableStateOf("") }
    var itemName by remember { mutableStateOf("") }
    var problem by remember { mutableStateOf("") }
    var estCost by remember { mutableStateOf("") }
    var advPaid by remember { mutableStateOf("") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("रिपेयरिंग जॉब कार्ड / टोकन", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) { Icon(Icons.Default.ArrowBack, contentDescription = null) }
                }
            )
        },
        floatingActionButton = {
            ExtendedFloatingActionButton(
                onClick = { showAddDialog = true },
                icon = { Icon(Icons.Default.Add, contentDescription = null) },
                text = { Text("नया सामान जमा करें") }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            if (jobCards.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("कोई पेंडिंग रिपेयरिंग टोकन नहीं है।", color = MaterialTheme.colorScheme.outline)
                }
            } else {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    items(jobCards) { job ->
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp),
                            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
                        ) {
                            Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(job.tokenNumber, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                                    SuggestionChip(
                                        onClick = {},
                                        label = { Text(job.status) }
                                    )
                                }
                                Text("सामान: ${job.itemName}", fontWeight = FontWeight.SemiBold)
                                Text("ग्राहक: ${job.customerName} (+91 ${job.customerPhone})", style = MaterialTheme.typography.bodySmall)
                                Text("खराबी: ${job.problemDescription}", style = MaterialTheme.typography.bodySmall, color = Color(0xFFDC2626))
                                Text("अंदाजन खर्च: ₹${job.estimatedCost} | एडवांस: ₹${job.advancePaid}", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold)

                                Button(
                                    onClick = {
                                        sendJobCardSlipWhatsApp(context, job, shopName)
                                    },
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Icon(Icons.Default.Send, contentDescription = null, modifier = Modifier.size(16.dp))
                                    Spacer(Modifier.width(6.dp))
                                    Text("WhatsApp रसीद टोकन भेजें")
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (showAddDialog) {
        AlertDialog(
            onDismissRequest = { showAddDialog = false },
            title = { Text("सामान जमा पर्ची (Job Token)") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(value = custName, onValueChange = { custName = it }, label = { Text("ग्राहक का नाम") }, singleLine = true)
                    OutlinedTextField(
                        value = custPhone,
                        onValueChange = { custPhone = it.filter { ch -> ch.isDigit() }.take(10) },
                        label = { Text("मोबाइल नंबर (10 Digit)") },
                        prefix = { Text("+91 ") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true
                    )
                    OutlinedTextField(value = itemName, onValueChange = { itemName = it }, label = { Text("सामान का नाम (उदा. पंखा, मोटर)") }, singleLine = true)
                    OutlinedTextField(value = problem, onValueChange = { problem = it }, label = { Text("शिकायत / क्या खराबी है") })
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedTextField(
                            value = estCost,
                            onValueChange = { estCost = it },
                            label = { Text("अंदाजन रेट ₹") },
                            modifier = Modifier.weight(1f),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
                        )
                        OutlinedTextField(
                            value = advPaid,
                            onValueChange = { advPaid = it },
                            label = { Text("एडवांस मिला ₹") },
                            modifier = Modifier.weight(1f),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
                        )
                    }
                }
            },
            confirmButton = {
                Button(onClick = {
                    val token = "TK-${(1000..9999).random()}"
                    jobCards.add(
                        JobCard(
                            id = "job_${System.currentTimeMillis()}",
                            tokenNumber = token,
                            customerName = custName.ifEmpty { "ग्राहक" },
                            customerPhone = custPhone,
                            itemName = itemName.ifEmpty { "सामान" },
                            problemDescription = problem.ifEmpty { "रिपेयरिंग कार्य" },
                            estimatedCost = estCost.toDoubleOrNull() ?: 0.0,
                            advancePaid = advPaid.toDoubleOrNull() ?: 0.0
                        )
                    )
                    showAddDialog = false
                    custName = ""; custPhone = ""; itemName = ""; problem = ""; estCost = ""; advPaid = ""
                }) { Text("टोकन बनाएं") }
            },
            dismissButton = { TextButton(onClick = { showAddDialog = false }) { Text("रद्द करें") } }
        )
    }
}

private fun sendJobCardSlipWhatsApp(context: Context, job: JobCard, shopName: String) {
    val message = """
        *जॉब कार्ड टोकन - $shopName*
        *टोकन संख्या:* ${job.tokenNumber}
        ------------------------------
        *ग्राहक:* ${job.customerName}
        *सामान:* ${job.itemName}
        *शिकायत:* ${job.problemDescription}
        *अनुमानित खर्च:* ₹${job.estimatedCost}
        *एडवांस जमा:* ₹${job.advancePaid}
        ------------------------------
        सामान तैयार होने पर आपको सूचित कर दिया जाएगा।
    """.trimIndent()

    try {
        val intent = Intent(Intent.ACTION_VIEW).apply {
            data = Uri.parse("https://api.whatsapp.com/send?phone=91${job.customerPhone}&text=${URLEncoder.encode(message, "UTF-8")}")
            setPackage("com.whatsapp")
        }
        context.startActivity(intent)
    } catch (_: Exception) {}
}
