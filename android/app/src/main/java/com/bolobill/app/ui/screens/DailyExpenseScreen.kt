package com.bolobill.app.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.bolobill.app.data.model.DailyExpense

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DailyExpenseScreen(
    todayTotalSales: Double,
    onBack: () -> Unit
) {
    val expenseList = remember { mutableStateListOf<DailyExpense>() }
    var showDialog by remember { mutableStateOf(false) }
    var category by remember { mutableStateOf("दुकान मटेरियल") }
    var note by remember { mutableStateOf("") }
    var amountText by remember { mutableStateOf("") }

    val totalExpense = expenseList.sumOf { it.amount }
    val netProfit = todayTotalSales - totalExpense

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("दुकान खर्चा और शुद्ध मुनाफ़ा", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) { Icon(Icons.Default.ArrowBack, contentDescription = null) }
                }
            )
        },
        floatingActionButton = {
            ExtendedFloatingActionButton(
                onClick = { showDialog = true },
                icon = { Icon(Icons.Default.Add, contentDescription = null) },
                text = { Text("खर्चा दर्ज करें") }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Net Summary Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f))
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("आज की कुल बिक्री:")
                        Text("₹${String.format("%.2f", todayTotalSales)}", fontWeight = FontWeight.Bold)
                    }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("आज का कुल खर्चा:", color = Color(0xFFDC2626))
                        Text("- ₹${String.format("%.2f", totalExpense)}", fontWeight = FontWeight.Bold, color = Color(0xFFDC2626))
                    }
                    HorizontalDivider()
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("शुद्ध बचत (Net Profit):", fontWeight = FontWeight.Bold)
                        Text(
                            "₹${String.format("%.2f", netProfit)}",
                            fontWeight = FontWeight.ExtraBold,
                            style = MaterialTheme.typography.titleLarge,
                            color = if (netProfit >= 0) Color(0xFF16A34A) else Color(0xFFDC2626)
                        )
                    }
                }
            }

            Text("आज के खर्चों की सूची", fontWeight = FontWeight.Bold)

            LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                items(expenseList) { item ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(10.dp),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth().padding(12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(item.category, fontWeight = FontWeight.SemiBold)
                                if (item.note.isNotEmpty()) {
                                    Text(item.note, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.outline)
                                }
                            }
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("₹${item.amount}", fontWeight = FontWeight.Bold, color = Color(0xFFDC2626))
                                IconButton(onClick = { expenseList.remove(item) }) {
                                    Icon(Icons.Default.Delete, contentDescription = null, tint = MaterialTheme.colorScheme.error)
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (showDialog) {
        AlertDialog(
            onDismissRequest = { showDialog = false },
            title = { Text("नया खर्चा जोड़ें") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    val categories = listOf("दुकान मटेरियल", "चाय-नाश्ता", "पेट्रोल/किराया", "अन्य ख़र्च")
                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        categories.take(2).forEach { c ->
                            FilterChip(selected = category == c, onClick = { category = c }, label = { Text(c) })
                        }
                    }
                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        categories.drop(2).forEach { c ->
                            FilterChip(selected = category == c, onClick = { category = c }, label = { Text(c) })
                        }
                    }
                    OutlinedTextField(value = note, onValueChange = { note = it }, label = { Text("विवरण (उदा. 2 टेप रोल)") }, singleLine = true)
                    OutlinedTextField(
                        value = amountText,
                        onValueChange = { amountText = it },
                        label = { Text("रुपये (₹)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true
                    )
                }
            },
            confirmButton = {
                Button(onClick = {
                    val amt = amountText.toDoubleOrNull() ?: 0.0
                    if (amt > 0) {
                        expenseList.add(
                            DailyExpense(
                                id = "exp_${System.currentTimeMillis()}",
                                category = category,
                                note = note,
                                amount = amt
                            )
                        )
                    }
                    showDialog = false; note = ""; amountText = ""
                }) { Text("जोड़ें") }
            },
            dismissButton = { TextButton(onClick = { showDialog = false }) { Text("रद्द करें") } }
        )
    }
}
