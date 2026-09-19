package com.bolobill.app.ui.screens

import android.content.Context
import androidx.compose.foundation.layout.*
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
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OnboardingScreen(
    onRegistrationComplete: (name: String, shop: String, city: String, phone: String, upi: String) -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var name by remember { mutableStateOf("") }
    var shopName by remember { mutableStateOf("") }
    var city by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var upiId by remember { mutableStateOf("") }
    var isSubmitting by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf("") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("BoloBill Profile Setup", fontWeight = FontWeight.Bold) }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Enter Shop / Service Details",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )
            Text(
                text = "Ye details aapke har invoice aur bill header par print hongi.",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.outline
            )

            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text("Owner Name*") },
                leadingIcon = { Icon(Icons.Default.Person, contentDescription = null) },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            OutlinedTextField(
                value = shopName,
                onValueChange = { shopName = it },
                label = { Text("Shop / Business Name*") },
                leadingIcon = { Icon(Icons.Default.Storefront, contentDescription = null) },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            OutlinedTextField(
                value = city,
                onValueChange = { city = it },
                label = { Text("City / Town*") },
                leadingIcon = { Icon(Icons.Default.LocationCity, contentDescription = null) },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            OutlinedTextField(
                value = phone,
                onValueChange = { input ->
                    phone = input.filter { it.isDigit() }.take(10)
                },
                label = { Text("Mobile Number (10 Digits)*") },
                leadingIcon = { Icon(Icons.Default.Phone, contentDescription = null) },
                prefix = { Text("+91 ", fontWeight = FontWeight.Bold) },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            OutlinedTextField(
                value = upiId,
                onValueChange = { upiId = it },
                label = { Text("UPI ID (For QR Payment)*") },
                placeholder = { Text("e.g. 9876543210@paytm") },
                leadingIcon = { Icon(Icons.Default.QrCode, contentDescription = null) },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            if (errorMessage.isNotEmpty()) {
                Text(errorMessage, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
            }

            Spacer(Modifier.weight(1f))

            Button(
                onClick = {
                    if (name.isBlank() || shopName.isBlank() || city.isBlank() || phone.length != 10 || upiId.isBlank()) {
                        errorMessage = "Kripya sabhi fields aur 10-digit mobile number bharein."
                        return@Button
                    }
                    isSubmitting = true
                    coroutineScope.launch {
                        withContext(Dispatchers.IO) {
                            try {
                                syncUserRegistrationToServer(name, shopName, city, phone, upiId)
                            } catch (_: Exception) {}
                        }

                        val prefs = context.getSharedPreferences("bolobill_prefs", Context.MODE_PRIVATE)
                        prefs.edit()
                            .putBoolean("is_registered", true)
                            .putString("owner_name", name)
                            .putString("shop_name", shopName)
                            .putString("city", city)
                            .putString("phone", phone)
                            .putString("upi_id", upiId)
                            .apply()

                        isSubmitting = false
                        onRegistrationComplete(name, shopName, city, phone, upiId)
                    }
                },
                enabled = !isSubmitting,
                modifier = Modifier.fillMaxWidth().height(50.dp),
                shape = RoundedCornerShape(12.dp)
            ) {
                if (isSubmitting) {
                    CircularProgressIndicator(modifier = Modifier.size(22.dp), color = Color.White)
                } else {
                    Text("Register & Continue", fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

private fun syncUserRegistrationToServer(name: String, shop: String, city: String, phone: String, upi: String) {
    try {
        // अपना असली Google Web App URL यहाँ डालें
        val scriptUrl = "https://script.google.com/macros/s/AKfycbzCE3WC2_470jzFwUa5yuApsfF-03QMoReXiJDqP8xvtEiOsp5CvVPUf2o-BylT26M7bQ/exec"
        val params = "name=${URLEncoder.encode(name, "UTF-8")}&shop=${URLEncoder.encode(shop, "UTF-8")}&city=${URLEncoder.encode(city, "UTF-8")}&phone=${URLEncoder.encode(phone, "UTF-8")}&upi=${URLEncoder.encode(upi, "UTF-8")}"
        
        var currentUrl = URL("$scriptUrl?$params")
        var redirects = 0
        
        // Follow redirects (HTTP 302) for Google Apps Script
        while (redirects < 4) {
            val conn = currentUrl.openConnection() as HttpURLConnection
            conn.instanceFollowRedirects = true
            conn.requestMethod = "GET"
            conn.connectTimeout = 8000
            conn.readTimeout = 8000
            
            val status = conn.responseCode
            if (status == HttpURLConnection.HTTP_MOVED_TEMP || status == HttpURLConnection.HTTP_MOVED_PERM || status == 307) {
                val newUrl = conn.getHeaderField("Location")
                conn.disconnect()
                if (newUrl != null) {
                    currentUrl = URL(newUrl)
                    redirects++
                    continue
                }
            }
            conn.disconnect()
            break
        }
    } catch (e: Exception) {
        e.printStackTrace()
    }
}
