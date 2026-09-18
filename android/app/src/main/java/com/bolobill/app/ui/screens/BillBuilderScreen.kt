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
    onNavigateToPreview: (Invoice) -> Unit
) {
    val context = LocalContext.current

    // दुकान / सर्विसमैन का विवरण
    var shopName by remember { mutableStateOf(currentInvoice.technicianName.ifEmpty { "मेरी दुकान / सर्विस सेंटर" }) }
    var shopPhone by remember { mutableStateOf(currentInvoice.technicianPhone) }
    var shopTrade by remember { mutableStateOf(currentInvoice.technicianTrade.ifEmpty { "इलेक्ट्रिकल एवं प्लंबिंग" }) }
    var upiId by remember { mutableStateOf(currentInvoice.technicianUpiId) }

    // ग्राहक विवरण
    var clientName by remember { mutableStateOf(currentInvoice.clientName) }
    var clientPhone by remember { mutableStateOf(currentInvoice.clientPhone) }

    // एडवांस और वारंटी
    var advanceText by remember { mutableStateOf(if (currentInvoice.advanceAmount > 0) currentInvoice.advanceAmount.toString() else "") }
    var selectedWarranty by remember { mutableStateOf(currentInvoice.warrantyTerm ?: "30_DAYS") }
    var isPaid by remember { mutableStateOf(currentInvoice.isPaid) }
    var beforePhotoUri by remember { mutableStateOf(currentInvoice.beforePhotoUri) }
    var afterPhotoUri by remember { mutableStateOf(currentInvoice.afterPhotoUri) }
    val itemsList = remember { mutableStateListOf<InvoiceItem>().apply { addAll(currentInvoice.items) } }

    // आइटम जोड़ने / एडिट करने का डायलॉग स्टेट
    var showItemDialog by remember { mutableStateOf(false) }
    var editingIndex by remember { mutableStateOf<Int?>(null) }
    var inputWorkName by remember { mutableStateOf("") }
    var inputQty by remember { mutableStateOf("1") }
    var inputUnit by remember { mutableStateOf("nos") }
    var inputRate by remember { mutableStateOf("") }

    // वॉइस रिकॉग्निशन लॉन्चर (Bolo Bill)
    val speechLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val spoken = result.data?.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)?.firstOrNull()
            if (!spoken.isNullOrBlank()) {
                val parsed = TradeDictionary.parseSpokenUtterance(spoken, TradeDictionary.LanguageMode.HINGLISH)
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
                title = { Text("BoloBill इनवॉइस मेकर", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
        },
        bottomBar = {
            Surface(tonalElevation = 8.dp, shadowElevation = 8.dp, modifier = Modifier.fillMaxWidth()) {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(14.dp),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    // बोलो बिल (Voice Mic) बटन
                    OutlinedButton(
                        onClick = {
                            val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                                putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                                putExtra(RecognizerIntent.EXTRA_LANGUAGE, "hi-IN")
                                putExtra(RecognizerIntent.EXTRA_PROMPT, "बोलिए: जैसे '1 पंखा फिटिंग 350 aur 2 switch board 200'")
                            }
                            try {
                                speechLauncher.launch(intent)
                            } catch (e: Exception) {
                                // fallback if voice service not found
                            }
                        },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.Mic, contentDescription = "Voice", tint = MaterialTheme.colorScheme.primary)
                        Spacer(Modifier.width(4.dp))
                        Text("बोलो बिल")
                    }

                    // PDF प्रिव्यू बटन
                    Button(
                        onClick = {
                            val subtotal = itemsList.sumOf { it.amount }
                            val adv = advanceText.toDoubleOrNull() ?: 0.0
                            val finalPayable = maxOf(0.0, subtotal - adv)
                            val updated = currentInvoice.copy(
                                technicianName = shopName.trim().ifEmpty { "सर्विस सेंटर" },
                                technicianPhone = shopPhone.trim(),
                                technicianTrade = shopTrade.trim(),
                                technicianUpiId = upiId.trim(),
                                clientName = clientName.trim().ifEmpty { "ग्राहक" },
                                clientPhone = clientPhone.trim(),
                                warrantyTerm = selectedWarranty,
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
                        Icon(Icons.Default.PictureAsPdf, contentDescription = "Generate PDF")
                        Spacer(Modifier.width(6.dp))
                        Text("बिल बनाएं & PDF")
                    }
                }
            }
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(paddingValues).padding(horizontal = 14.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // 1. दुकान / सर्विसमैन विवरण कार्ड
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                ) {
                    Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("आपकी दुकान / सर्विसमैन विवरण (Bill Header)", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleSmall)
                        OutlinedTextField(
                            value = shopName,
                            onValueChange = { shopName = it },
                            label = { Text("दुकान / आपका नाम") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedTextField(
                                value = shopPhone,
                                onValueChange = { shopPhone = it },
                                label = { Text("मोबाइल नंबर") },
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                                singleLine = true,
                                modifier = Modifier.weight(1f)
                            )
                            OutlinedTextField(
                                value = upiId,
                                onValueChange = { upiId = it },
                                label = { Text("UPI ID (QR पेमेंट हेतु)") },
                                placeholder = { Text("mobile@paytm") },
                                singleLine = true,
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }
                }
            }

            // 2. ग्राहक विवरण
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.35f))
                ) {
                    Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("ग्राहक विवरण (Customer Details)", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleSmall)
                        OutlinedTextField(
                            value = clientName,
                            onValueChange = { clientName = it },
                            label = { Text("ग्राहक का नाम") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                        OutlinedTextField(
                            value = clientPhone,
                            onValueChange = { clientPhone = it },
                            label = { Text("ग्राहक का WhatsApp नंबर") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            }

            // 3. काम और सामान (Custom Line Items)
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

            // आइटम्स की सूची (टैप करने पर एडिट होगा)
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
                            Text(item.name, fontWeight = FontWeight.SemiBold, style = MaterialTheme.typography.bodyLarge)
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

            // 4. बिल योग & एडवांस पेमेंट कैलकुलेशन
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
                            Text("कुल काम का बिल (Subtotal):", style = MaterialTheme.typography.bodyLarge)
                            Text("₹$subtotal", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                        }

                        // एडवांस पेमेंट इनपुट फ़ील्ड
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
                            Text("बाकी राशि (Balance Payable):", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
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

            // 5. काम के फ़ोटो (Before / After)
            item {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("काम का प्रमाण फ़ोटो (Before & After)", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleSmall)
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

            // 6. सर्विस वारंटी चिप्स
            item {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("सर्विस गारंटी / वारंटी", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleSmall)
                    val warrantyOptions = listOf(
                        "NO_WARRANTY" to "कोई वारंटी नहीं",
                        "15_DAYS" to "15 दिन गारंटी",
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

            // 7. भुगतान रसीद मोड स्विच
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
                                if (isPaid) "PDF पर हरे रंग का PAID स्टैम्प लगेगा" else "PDF पर स्कैन करने हेतु UPI QR कोड रहेगा",
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

    // काम / आइटम कस्टमाइज़ करने का डायलॉग
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
                        placeholder = { Text("उदा. पंखा फिटिंग / पाइप रिपेयर") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedTextField(
                            value = inputQty,
                            onValueChange = { inputQty = it },
                            label = { Text("संख्या (Qty)") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            modifier = Modifier.weight(1f)
                        )
                        OutlinedTextField(
                            value = inputUnit,
                            onValueChange = { inputUnit = it },
                            label = { Text("यूनिट") },
                            placeholder = { Text("nos, ft, job") },
                            modifier = Modifier.weight(1f)
                        )
                    }
                    OutlinedTextField(
                        value = inputRate,
                        onValueChange = { inputRate = it },
                        label = { Text("कीमत / रेट (₹)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
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
                        unit = inputUnit.trim().ifEmpty { "nos" },
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
