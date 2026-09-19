package com.bolobill.app.ui.screens

import android.content.Context
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileSettingsScreen(
    onBack: () -> Unit,
    onSaved: (shop: String, phone: String, city: String, upi: String) -> Unit
) {
    val context = LocalContext.current
    val prefs = remember { context.getSharedPreferences("bolobill_prefs", Context.MODE_PRIVATE) }

    var shopName by remember { mutableStateOf(prefs.getString("shop_name", "") ?: "") }
    var phone by remember { mutableStateOf(prefs.getString("phone", "") ?: "") }
    var city by remember { mutableStateOf(prefs.getString("city", "") ?: "") }
    var upiId by remember { mutableStateOf(prefs.getString("upi_id", "") ?: "") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("दुकान व प्रोफ़ाइल सेटिंग्स", fontWeight = FontWeight.Bold) },
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
                .padding(18.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            OutlinedTextField(
                value = shopName,
                onValueChange = { shopName = it },
                label = { Text("दुकान / फ़र्म का नाम") },
                leadingIcon = { Icon(Icons.Default.Storefront, contentDescription = null) },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            OutlinedTextField(
                value = city,
                onValueChange = { city = it },
                label = { Text("शहर / कस्बा") },
                leadingIcon = { Icon(Icons.Default.LocationCity, contentDescription = null) },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            OutlinedTextField(
                value = phone,
                onValueChange = { phone = it.filter { ch -> ch.isDigit() }.take(10) },
                label = { Text("मोबाइल नंबर (10 Digits)") },
                prefix = { Text("+91 ", fontWeight = FontWeight.Bold) },
                leadingIcon = { Icon(Icons.Default.Phone, contentDescription = null) },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            OutlinedTextField(
                value = upiId,
                onValueChange = { upiId = it },
                label = { Text("UPI ID (भुगतान प्राप्त करने हेतु)") },
                placeholder = { Text("mobile@paytm / upi") },
                leadingIcon = { Icon(Icons.Default.QrCode, contentDescription = null) },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(Modifier.weight(1f))

            Button(
                onClick = {
                    prefs.edit()
                        .putString("shop_name", shopName)
                        .putString("phone", phone)
                        .putString("city", city)
                        .putString("upi_id", upiId)
                        .apply()
                    onSaved(shopName, phone, city, upiId)
                    onBack()
                },
                modifier = Modifier.fillMaxWidth().height(50.dp),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.Save, contentDescription = null)
                Spacer(Modifier.width(8.dp))
                Text("सेव करें", fontWeight = FontWeight.Bold)
            }
        }
    }
}
