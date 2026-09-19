package com.bolobill.app.ui.screens

import android.app.Activity
import android.content.Intent
import android.speech.RecognizerIntent
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
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
import androidx.compose.ui.text.input.KeyboardType
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
    onNavigateToPreview: (Invoice) -> Unit,
    onNavigateToSettings: () -> Unit = {}
) {
    val context = LocalContext.current

    // Language State
    var selectedLanguage by remember { mutableStateOf(currentInvoice.pdfLanguage.ifEmpty { "HINGLISH" }) }

    // Shop Details
    var shopName by remember { mutableStateOf(currentInvoice.technicianName) }
    var shopPhone by remember { mutableStateOf(currentInvoice.technicianPhone) }
    var shopTrade by remember { mutableStateOf(currentInvoice.technicianTrade) }
    var upiId by remember { mutableStateOf(currentInvoice.technicianUpiId) }

    // Customer Details (+91 & 10-digit lock)
    var clientName by remember { mutableStateOf(currentInvoice.clientName) }
    var clientPhone by remember { mutableStateOf(currentInvoice.clientPhone) }

    // GST States
var isGstInvoice by remember { mutableStateOf(currentInvoice.isGstInvoice) }
var gstNumber by remember { mutableStateOf(currentInvoice.gstNumber) }
val gstRate = 18.0

// Live Calculation Logic
val subtotal = itemsList.sumOf { it.amount }
val gstAmount = if (isGstInvoice) (subtotal * (gstRate / 100.0)) else 0.0
val grossTotal = subtotal + gstAmount
val adv = advanceText.toDoubleOrNull() ?: 0.0
val balanceDue = maxOf(0.0, grossTotal - adv)
    // Billing & Advance
    var advanceText by remember { mutableStateOf(if (currentInvoice.advanceAmount > 0) currentInvoice.advanceAmount.toString() else "") }
    var selectedWarranty by remember { mutableStateOf(currentInvoice.warrantyTerm ?: "30_DAYS") }
    var isPaid by remember { mutableStateOf(currentInvoice.isPaid) }
    var beforePhotoUri by remember { mutableStateOf(currentInvoice.beforePhotoUri) }
    var afterPhotoUri by remember { mutableStateOf(currentInvoice.afterPhotoUri) }
    val itemsList = remember { mutableStateListOf<InvoiceItem>().apply { addAll(currentInvoice.items) } }

    // Dialog State
    var showItemDialog by remember { mutableStateOf(false) }
    var editingIndex by remember { mutableStateOf<Int?>(null) }
    var inputWorkName by remember { mutableStateOf("") }
    var inputQty by remember { mutableStateOf("1") }
    var inputUnit by remember { mutableStateOf("nos") }
    var inputRate by remember { mutableStateOf("") }

    val unitsList = listOf("nos", "kg", "gm", "mtr", "ft", "coil", "pkt", "job")

    val speechLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val spoken = result.data?.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)?.firstOrNull()
            if (!spoken.isNullOrBlank()) {
                val mode = if (selectedLanguage == "ENGLISH") TradeDictionary.LanguageMode.ENGLISH else TradeDictionary.LanguageMode.HINGLISH
                val parsed = TradeDictionary.parseSpokenUtterance(spoken, mode)
                parsed.forEach { item ->
                    itemsList.add(
                        InvoiceItem(
                            id = "item_${System.currentTimeMillis()}_${(1..1000).random()}",
                            name = item.name,
                            quantity = item.quantity,
                            unit = item.unit,
                            rate = item.rate,
                            amount = item.amount
                        )
                    )
                }
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (selectedLanguage == "ENGLISH") "BoloBill Quotation" else "BoloBill इनवॉइस", fontWeight = FontWeight.Bold) },
                actions = {
                    // Language Change Option
                    TextButton(onClick = {
                        selectedLanguage = if (selectedLanguage == "ENGLISH") "HINGLISH" else "ENGLISH"
                    }) {
                        Icon(Icons.Default.Translate, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(4.dp))
                        Text(if (selectedLanguage == "ENGLISH") "EN" else "HI/हिन्दी")
                    }

                    // Settings Button
                    IconButton(onClick = onNavigateToSettings) {
                        Icon(Icons.Default.Settings, contentDescription = "Settings")
                    }
                }
            )
        },
        bottomBar = {
            Surface(tonalElevation = 8.dp, shadowElevation = 8.dp, modifier = Modifier.fillMaxWidth()) {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(14.dp),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    OutlinedButton(
                        onClick = {
                            val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                                putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                                putExtra(RecognizerIntent.EXTRA_LANGUAGE, if (selectedLanguage == "ENGLISH") "en-IN" else "hi-IN")
                                putExtra(RecognizerIntent.EXTRA_PROMPT, "बोलिए: जैसे '2 kg taar 400 aur 1 pankha fitting 350'")
                            }
                            try { speechLauncher.launch(intent) } catch (_: Exception) {}
                        },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.Mic, contentDescription = "Voice", tint = MaterialTheme.colorScheme.primary)
                        Spacer(Modifier.width(4.dp))
                        Text("बोलो बिल")
                    }

                    Button(
                        onClick = {
                            val subtotal = itemsList.sumOf { it.amount }
                            val adv = advanceText.toDoubleOrNull() ?: 0.0
                            val finalPayable = maxOf(0.0, subtotal - adv)
                            val updated = currentInvoice.copy(
                                technicianName = shopName.ifEmpty { "Service Center" },
                                technicianPhone = shopPhone,
                                technicianTrade = shopTrade,
                                technicianUpiId = upiId,
                                clientName = clientName.ifEmpty { "Customer" },
                                clientPhone = if (clientPhone.isNotEmpty()) "+91 $clientPhone" else "",
                                warrantyTerm = selectedWarranty,
                                pdfLanguage = selectedLanguage,
                                beforePhotoUri = beforePhotoUri,
                                afterPhotoUri = afterPhotoUri,
                                items = itemsList.toList(),
                                subtotal = subtotal,
                                advanceAmount = adv,
                                totalAmount = finalPayable,
                                isPaid = isPaid,
                                paidDate = if (isPaid) (currentInvoice.paidDate ?: System.currentTimeMillis()) else null
                            )
                            onSaveInvoice(updated)
                            onNavigateToPreview(updated)
                        },
                        modifier = Modifier.weight(1.3f),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.PictureAsPdf, contentDescription = "PDF")
                        Spacer(Modifier.width(6.dp))
                        Text("Preview & PDF")
                    }
                }
            }
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(paddingValues).padding(horizontal = 14.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Customer Details Card
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f))
                ) {
                    Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("ग्राहक विवरण (Customer Details)", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleSmall)
                        OutlinedTextField(
                            value = clientName,
                            onValueChange = { clientName = it },
                            label = { Text("ग्राहक का नाम") },
                            leadingIcon = { Icon(Icons.Default.Person, contentDescription = null) },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                        OutlinedTextField(
                            value = clientPhone,
                            onValueChange = { input ->
                                clientPhone = input.filter { it.isDigit() }.take(10)
                            },
                            label = { Text("WhatsApp नंबर (10 Digits)") },
                            prefix = { Text("+91 ", fontWeight = FontWeight.Bold) },
                            leadingIcon = { Icon(Icons.Default.Phone, contentDescription = null) },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            }

            // Line Items List Header
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("काम और सामान सूची (${itemsList.size})", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleSmall)
                    Button(
                        onClick = {
                            editingIndex = null
                            inputWorkName = ""
                            inputQty = "1"
                            inputUnit = "nos"
                            inputRate = ""
                            showItemDialog = true
                        },
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = "Add Item")
                        Spacer(Modifier.width(4.dp))
                        Text("काम जोड़ें")
                    }
                }
            }

            itemsIndexed(itemsList) { index, item ->
                Card(
                    modifier = Modifier.fillMaxWidth().clickable {
                        editingIndex = index
                        inputWorkName = item.name
                        inputQty = item.quantity.toString()
                        inputUnit = item.unit
                        inputRate = item.rate.toString()
                        showItemDialog = true
                    },
                    shape = RoundedCornerShape(10.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(item.name, fontWeight = FontWeight.SemiBold)
                            Text(
                                "दर: ₹${item.rate} x ${item.quantity} ${item.unit}",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.outline
                            )
                        }
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Text("₹${item.amount}", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                            IconButton(onClick = { itemsList.removeAt(index) }) {
                                Icon(Icons.Default.Delete, contentDescription = "Delete", tint = MaterialTheme.colorScheme.error)
                            }
                        }
                    }
                }
            }

            // Advance & Balance Calculation Card
            item {
                val subtotal = itemsList.sumOf { it.amount }
                val adv = advanceText.toDoubleOrNull() ?: 0.0
                val balanceDue = maxOf(0.0, subtotal - adv)

                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.25f))
                ) {
                    Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("कुल बिल (Subtotal):", style = MaterialTheme.typography.bodyLarge)
                            Text("₹$subtotal", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                        }

                        OutlinedTextField(
                            value = advanceText,
                            onValueChange = { advanceText = it },
                            label = { Text("एडवांस मिला (Advance Received ₹)") },
                            placeholder = { Text("0") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )

                        HorizontalDivider()

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("बाकी राशि (Balance Due):", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                            Text(
                                "₹$balanceDue",
                                fontWeight = FontWeight.ExtraBold,
                                color = Color(0xFF16A34A),
                                style = MaterialTheme.typography.headlineSmall
                            )
                        }
                    }
                }
            }

            Card(
    modifier = Modifier.fillMaxWidth(),
    shape = RoundedCornerShape(12.dp),
    colors = CardDefaults.cardColors(
        containerColor = if (isGstInvoice) Color(0xFFEFF6FF) else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.35f)
    )
) {
    Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Text(
                    if (isGstInvoice) "पक्का GST बिल (Tax Invoice 18%)" else "कच्चा बिल / कोटेशन (Estimate Bill)",
                    fontWeight = FontWeight.Bold,
                    color = if (isGstInvoice) Color(0xFF1D4ED8) else MaterialTheme.colorScheme.onSurface
                )
                Text(
                    if (isGstInvoice) "CGST 9% + SGST 9% लागू होगा" else "बिना टैक्स का साधारण एस्टीमेट",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.outline
                )
            }
            Switch(
                checked = isGstInvoice,
                onCheckedChange = { isGstInvoice = it }
            )
        }

        if (isGstInvoice) {
            OutlinedTextField(
                value = gstNumber,
                onValueChange = { gstNumber = it.uppercase() },
                label = { Text("GSTIN नंबर (वैकल्पिक)") },
                placeholder = { Text("07AAAAA0000A1Z5") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}
            // Work Proof Photos
            item {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("काम का प्रमाण फोटो (Before & After)", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleSmall)
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
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

            // Warranty Chips
            item {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("सर्विस गारंटी / वारंटी", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleSmall)
                    val warrantyOptions = listOf(
                        "NO_WARRANTY" to "कोई वारंटी नहीं",
                        "15_DAYS" to "15 दिन",
                        "30_DAYS" to "30 दिन गारंटी",
                        "90_DAYS" to "90 दिन गारंटी"
                    )
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        warrantyOptions.forEach { (key, label) ->
                            val isSelected = selectedWarranty == key
                            FilterChip(
                                selected = isSelected,
                                onClick = { selectedWarranty = key },
                                label = { Text(label, style = MaterialTheme.typography.labelSmall) }
                            )
                        }
                    }
                }
            }

            // Mark as Paid Switch
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = if (isPaid) Color(0xFFF0FDF4) else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.35f)
                    )
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text(
                                if (isPaid) "पूरा भुगतान प्राप्त हुआ (PAID)" else "भुगतान बाकी है (PENDING)",
                                fontWeight = FontWeight.Bold,
                                color = if (isPaid) Color(0xFF166534) else MaterialTheme.colorScheme.onSurface
                            )
                            Text(
                                if (isPaid) "PDF पर हरे रंग का PAID स्टैम्प लगेगा" else "PDF पर स्कैन हेतु UPI QR कोड रहेगा",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.outline
                            )
                        }
                        Switch(checked = isPaid, onCheckedChange = { isPaid = it })
                    }
                }
            }
        }
    }

    // Custom Item Input Dialog with Unit Dropdown/Selection
    if (showItemDialog) {
        AlertDialog(
            onDismissRequest = { showItemDialog = false },
            title = { Text(if (editingIndex != null) "काम में सुधार करें" else "नया काम / सामान जोड़ें") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = inputWorkName,
                        onValueChange = { inputWorkName = it },
                        label = { Text("काम / सामान का नाम") },
                        placeholder = { Text("उदा. कॉपर वायर / पाइप फिटिंग") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedTextField(
                            value = inputQty,
                            onValueChange = { inputQty = it },
                            label = { Text("मात्रा (Qty)") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            modifier = Modifier.weight(1f)
                        )
                        OutlinedTextField(
                            value = inputRate,
                            onValueChange = { inputRate = it },
                            label = { Text("दर/रेट (₹)") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            modifier = Modifier.weight(1f)
                        )
                    }

                    Text("यूनिट चुनें:", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold)
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        unitsList.take(4).forEach { u ->
                            FilterChip(
                                selected = inputUnit == u,
                                onClick = { inputUnit = u },
                                label = { Text(u, fontSize = 11.sp) }
                            )
                        }
                    }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        unitsList.drop(4).forEach { u ->
                            FilterChip(
                                selected = inputUnit == u,
                                onClick = { inputUnit = u },
                                label = { Text(u, fontSize = 11.sp) }
                            )
                        }
                    }
                }
            },
            confirmButton = {
                Button(onClick = {
                    val rate = inputRate.toDoubleOrNull() ?: 0.0
                    val qty = inputQty.toIntOrNull() ?: 1
                    val name = inputWorkName.trim().ifEmpty { "सर्विस कार्य" }
                    val item = InvoiceItem(
                        id = if (editingIndex != null) itemsList[editingIndex!!].id else "item_${System.currentTimeMillis()}",
                        name = name,
                        quantity = qty,
                        unit = inputUnit,
                        rate = rate,
                        amount = qty * rate
                    )
                    if (editingIndex != null) {
                        itemsList[editingIndex!!] = item
                    } else {
                        itemsList.add(item)
                    }
                    showItemDialog = false
                }) {
                    Text("सेव करें")
                }
            },
            dismissButton = {
                TextButton(onClick = { showItemDialog = false }) { Text("रद्द करें") }
            }
        )
    }
}
