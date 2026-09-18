package com.bolobill.app.ui.screens

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bolobill.app.data.model.Invoice
import com.bolobill.app.data.model.InvoiceItem
import com.bolobill.app.util.TradeDictionary
import com.bolobill.app.util.WorkProofThumbnailSlot

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BillBuilderScreen(
    currentInvoice: Invoice,
    onSaveInvoice: (Invoice) -> Unit,
    onNavigateToPreview: (Invoice) -> Unit
) {
    val context = LocalContext.current
    var clientName by remember { mutableStateOf(currentInvoice.clientName) }
    var clientPhone by remember { mutableStateOf(currentInvoice.clientPhone) }
    var clientAddress by remember { mutableStateOf(currentInvoice.clientAddress) }
    var selectedWarranty by remember { mutableStateOf(currentInvoice.warrantyTerm ?: "30_DAYS") }
    var languageMode by remember { mutableStateOf(if (currentInvoice.pdfLanguage == "HINGLISH") TradeDictionary.LanguageMode.HINGLISH else TradeDictionary.LanguageMode.ENGLISH) }
    var isPaid by remember { mutableStateOf(currentInvoice.isPaid) }
    var beforePhotoUri by remember { mutableStateOf(currentInvoice.beforePhotoUri) }
    var afterPhotoUri by remember { mutableStateOf(currentInvoice.afterPhotoUri) }
    val itemsList = remember { mutableStateListOf<InvoiceItem>().apply { addAll(currentInvoice.items) } }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("BoloBill Quotation", style = MaterialTheme.typography.titleMedium)
                        Text(
                            text = if (languageMode == TradeDictionary.LanguageMode.ENGLISH) "Mode: Professional English" else "Mode: Hinglish (बोलचाल)",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                },
                actions = {
                    TextButton(onClick = {
                        languageMode = if (languageMode == TradeDictionary.LanguageMode.ENGLISH)
                            TradeDictionary.LanguageMode.HINGLISH else TradeDictionary.LanguageMode.ENGLISH
                        itemsList.forEachIndexed { index, it ->
                            val updated = TradeDictionary.normalizeTerm(it.name, languageMode)
                            itemsList[index] = it.copy(name = updated)
                        }
                    }) {
                        Icon(Icons.Default.Translate, contentDescription = "Language", modifier = Modifier.size(18.dp))
                        Spacer(Modifier.width(4.dp))
                        Text(if (languageMode == TradeDictionary.LanguageMode.ENGLISH) "EN" else "HI/Hinglish")
                    }
                }
            )
        },
        bottomBar = {
            Surface(
                tonalElevation = 8.dp,
                shadowElevation = 8.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Button(
                        onClick = {
                            val subtotal = itemsList.sumOf { it.amount }
                            val updated = currentInvoice.copy(
                                clientName = clientName,
                                clientPhone = clientPhone,
                                clientAddress = clientAddress,
                                warrantyTerm = selectedWarranty,
                                pdfLanguage = languageMode.name,
                                beforePhotoUri = beforePhotoUri,
                                afterPhotoUri = afterPhotoUri,
                                items = itemsList.toList(),
                                subtotal = subtotal,
                                totalAmount = subtotal - currentInvoice.discount,
                                isPaid = isPaid,
                                paidDate = if (isPaid) (currentInvoice.paidDate ?: System.currentTimeMillis()) else null
                            )
                            onSaveInvoice(updated)
                            onNavigateToPreview(updated)
                        },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.PictureAsPdf, contentDescription = "Generate PDF")
                        Spacer(Modifier.width(6.dp))
                        Text("Preview & PDF")
                    }
                }
            }
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f))
                ) {
                    Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Text("Customer Details / ग्राहक विवरण", style = MaterialTheme.typography.titleSmall)
                        OutlinedTextField(
                            value = clientName,
                            onValueChange = { clientName = it },
                            label = { Text("Customer Name") },
                            leadingIcon = { Icon(Icons.Default.Person, contentDescription = null) },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                        OutlinedTextField(
                            value = clientPhone,
                            onValueChange = { clientPhone = it },
                            label = { Text("WhatsApp Number") },
                            leadingIcon = { Icon(Icons.Default.Phone, contentDescription = null) },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            }

            // Work Proof Photos
            item {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "Work Proof Photos / काम का फोटो (Before & After)",
                        style = MaterialTheme.typography.titleSmall
                    )
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        WorkProofThumbnailSlot(
                            title = "Before Work",
                            photoUri = beforePhotoUri,
                            onPhotoSelected = { beforePhotoUri = it },
                            modifier = Modifier.weight(1f)
                        )
                        WorkProofThumbnailSlot(
                            title = "After Work",
                            photoUri = afterPhotoUri,
                            onPhotoSelected = { afterPhotoUri = it },
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }

            // Service Guarantee
            item {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "Service Guarantee / सर्विस गारंटी",
                        style = MaterialTheme.typography.titleSmall
                    )
                    val warrantyOptions = listOf(
                        "NO_WARRANTY" to "No Warranty",
                        "15_DAYS" to "15 Days",
                        "30_DAYS" to "30 Days Guarantee",
                        "90_DAYS" to "90 Days Extended"
                    )
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        warrantyOptions.forEach { (key, label) ->
                            val isSelected = selectedWarranty == key
                            FilterChip(
                                selected = isSelected,
                                onClick = { selectedWarranty = key },
                                label = { Text(label, style = MaterialTheme.typography.labelSmall) },
                                leadingIcon = if (isSelected) {
                                    { Icon(Icons.Default.Verified, contentDescription = null, modifier = Modifier.size(16.dp)) }
                                } else null
                            )
                        }
                    }
                }
            }

            // Line Items Section
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Bill Items / बिल आइटम", style = MaterialTheme.typography.titleSmall)
                    TextButton(onClick = {
                        itemsList.add(
                            InvoiceItem(
                                id = "item_${System.currentTimeMillis()}",
                                name = "New Work Item",
                                quantity = 1,
                                unit = "nos",
                                rate = 250.0,
                                amount = 250.0
                            )
                        )
                    }) {
                        Icon(Icons.Default.Add, contentDescription = "Add")
                        Text("Add Item")
                    }
                }
            }

            itemsIndexed(itemsList) { index, item ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(item.name, style = MaterialTheme.typography.titleSmall)
                            Text(
                                "₹${item.rate} x ${item.quantity} ${item.unit} = ₹${item.amount}",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.primary
                            )
                        }
                        IconButton(onClick = { itemsList.removeAt(index) }) {
                            Icon(Icons.Default.Delete, contentDescription = "Remove", tint = MaterialTheme.colorScheme.error)
                        }
                    }
                }
            }

            // Mark as Paid Switch
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = if (isPaid) Color(0xFFF0FDF4) else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f)
                    )
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(10.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Icon(
                                imageVector = if (isPaid) Icons.Default.CheckCircle else Icons.Default.Pending,
                                contentDescription = null,
                                tint = if (isPaid) Color(0xFF16A34A) else MaterialTheme.colorScheme.outline
                            )
                            Column {
                                Text(
                                    text = if (isPaid) "Marked as Paid (भुगतान प्राप्त)" else "Payment Pending (भुगतान बाकी)",
                                    style = MaterialTheme.typography.titleSmall,
                                    color = if (isPaid) Color(0xFF166534) else MaterialTheme.colorScheme.onSurface
                                )
                                Text(
                                    text = if (isPaid) "Watermark stamp active • QR suppressed" else "Toggle on to mark invoice as paid",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.outline
                                )
                            }
                        }
                        Switch(
                            checked = isPaid,
                            onCheckedChange = { isPaid = it },
                            thumbContent = if (isPaid) {
                                { Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(14.dp)) }
                            } else null
                        )
                    }
                }
            }

            // Live Preview Card
            item {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "Invoice Live Preview / लाइव बिल प्रिव्यू",
                        style = MaterialTheme.typography.titleSmall
                    )
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(
                                modifier = Modifier.fillMaxWidth(),
                                verticalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.Top
                                ) {
                                    Column {
                                        Text(
                                            text = "BOLOBILL INVOICE",
                                            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                                            color = MaterialTheme.colorScheme.primary
                                        )
                                        Text(
                                            text = "#${currentInvoice.invoiceNumber}",
                                            style = MaterialTheme.typography.labelSmall,
                                            color = MaterialTheme.colorScheme.outline
                                        )
                                    }
                                    Column(horizontalAlignment = Alignment.End) {
                                        Text(
                                            text = currentInvoice.technicianName,
                                            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.SemiBold)
                                        )
                                        Text(
                                            text = currentInvoice.technicianTrade,
                                            style = MaterialTheme.typography.labelSmall,
                                            color = MaterialTheme.colorScheme.outline
                                        )
                                    }
                                }
                                HorizontalDivider(color = MaterialTheme.colorScheme.surfaceVariant)

                                val subtotal = itemsList.sumOf { it.amount }
                                val total = subtotal - currentInvoice.discount
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = "Total Amount",
                                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                                    )
                                    Text(
                                        text = "₹$total",
                                        style = MaterialTheme.typography.titleMedium.copy(
                                            fontWeight = FontWeight.Bold,
                                            color = MaterialTheme.colorScheme.primary
                                        )
                                    )
                                }
                            }

                            PaidWatermarkStamp(
                                isPaid = isPaid,
                                modifier = Modifier.align(Alignment.Center)
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun PaidWatermarkStamp(
    isPaid: Boolean,
    modifier: Modifier = Modifier
) {
    val watermarkAlpha by animateFloatAsState(
        targetValue = if (isPaid) 0.85f else 0.0f,
        animationSpec = tween(durationMillis = 400, easing = FastOutSlowInEasing),
        label = "WatermarkAlpha"
    )
    val watermarkScale by animateFloatAsState(
        targetValue = if (isPaid) 1.0f else 1.30f,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessLow
        ),
        label = "WatermarkScale"
    )
    val watermarkRotation by animateFloatAsState(
        targetValue = if (isPaid) -18f else -24f,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessMedium
        ),
        label = "WatermarkRotation"
    )

    if (watermarkAlpha > 0.01f) {
        Box(
            modifier = modifier
                .graphicsLayer {
                    alpha = watermarkAlpha
                    scaleX = watermarkScale
                    scaleY = watermarkScale
                    rotationZ = watermarkRotation
                }
                .border(
                    BorderStroke(2.5.dp, Color(0xFF16A34A)),
                    shape = RoundedCornerShape(12.dp)
                )
                .background(
                    Color(0xFF22C55E).copy(alpha = 0.12f),
                    shape = RoundedCornerShape(12.dp)
                )
                .padding(horizontal = 20.dp, vertical = 8.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "PAID",
                    style = MaterialTheme.typography.headlineMedium.copy(
                        fontWeight = FontWeight.Black,
                        letterSpacing = 4.sp
                    ),
                    color = Color(0xFF16A34A)
                )
                Text(
                    text = "भुगतान प्राप्त हुआ",
                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                    color = Color(0xFF15803D)
                )
            }
        }
    }
}
