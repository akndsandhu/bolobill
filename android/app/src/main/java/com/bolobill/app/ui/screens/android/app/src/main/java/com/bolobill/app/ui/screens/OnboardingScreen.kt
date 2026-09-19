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
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

// ==========================================
// APNI 2FACTOR.IN API KEY YAHAN DAALEIN
// ==========================================
private const val TWO_FACTOR_API_KEY = "1571c137-b3fa-11f1-af74-0200cd936042"

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

    // OTP States
    var isOtpSent by remember { mutableStateOf(false) }
    var isOtpVerified by remember { mutableStateOf(false) }
    var otpInput by remember { mutableStateOf("") }
    var otpSessionId by remember { mutableStateOf("") }
    var isSendingOtp by remember { mutableStateOf(false) }
    var isVerifyingOtp by remember { mutableStateOf(false) }

    var isSubmitting by remember { mutableStateOf(false) }
    var statusMessage by remember { mutableStateOf("") }
    var isError by remember { mutableStateOf(false) }

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
            verticalArrangement = Arrangement.spacedBy(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Dukaan & Profile Registration",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )
            Text(
                text = "Pehle apna mobile number OTP se verify karein taaki profile activate ho sake.",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.outline
            )

            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text("Aapka Naam (Owner Name)*") },
                leadingIcon = { Icon(Icons.Default.Person, contentDescription = null) },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            OutlinedTextField(
                value = shopName,
                onValueChange = { shopName = it },
                label = { Text("Dukaan / Business Name*") },
                leadingIcon = { Icon(Icons.Default.Storefront, contentDescription = null) },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            OutlinedTextField(
                value = city,
                onValueChange = { city = it },
                label = { Text("Shahar / City*") },
                leadingIcon = { Icon(Icons.Default.LocationCity, contentDescription = null) },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            // Mobile Number + OTP Trigger
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedTextField(
                    value = phone,
                    onValueChange = { input ->
                        if (!isOtpVerified) {
                            phone = input.filter { it.isDigit() }.take(10)
                        }
                    },
                    enabled = !isOtpVerified,
                    label = { Text("Mobile Number*") },
                    prefix = { Text("+91 ", fontWeight = FontWeight.Bold) },
                    leadingIcon = { Icon(Icons.Default.Phone, contentDescription = null) },
                    trailingIcon = {
                        if (isOtpVerified) {
                            Icon(Icons.Default.CheckCircle, contentDescription = "Verified", tint = Color(0xFF16A34A))
                        }
                    },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    singleLine = true,
                    modifier = Modifier.weight(1f)
                )

                if (!isOtpVerified) {
                    Button(
                        onClick = {
                            if (phone.length != 10) {
                                statusMessage = "Pehle 10-digit mobile number bharein."
                                isError = true
                                return@Button
                            }
                            isSendingOtp = true
                            statusMessage = ""
                            coroutineScope.launch {
                                val result = withContext(Dispatchers.IO) {
                                    send2FactorOtp(phone)
                                }
                                isSendingOtp = false
                                if (result.first) {
                                    otpSessionId = result.second
                                    isOtpSent = true
                                    isError = false
                                    statusMessage = "OTP aapke phone par bhej diya gaya hai."
                                } else {
                                    isError = true
                                    statusMessage = result.second
                                }
                            }
                        },
                        enabled = !isSendingOtp && phone.length == 10,
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.height(56.dp)
                    ) {
                        if (isSendingOtp) {
                            CircularProgressIndicator(modifier = Modifier.size(18.dp), color = Color.White)
                        } else {
                            Text(if (isOtpSent) "Resend" else "Get OTP")
                        }
                    }
                }
            }

            // OTP Input Box (Jab OTP chala jaye aur verify na hua ho)
            if (isOtpSent && !isOtpVerified) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedTextField(
                        value = otpInput,
                        onValueChange = { input -> otpInput = input.filter { it.isDigit() }.take(6) },
                        label = { Text("Enter 6-Digit OTP") },
                        leadingIcon = { Icon(Icons.Default.Password, contentDescription = null) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        modifier = Modifier.weight(1f)
                    )

                    Button(
                        onClick = {
                            if (otpInput.length < 4) {
                                statusMessage = "Valid OTP daalein."
                                isError = true
                                return@Button
                            }
                            isVerifyingOtp = true
                            statusMessage = ""
                            coroutineScope.launch {
                                val verified = withContext(Dispatchers.IO) {
                                    verify2FactorOtp(otpSessionId, otpInput)
                                }
                                isVerifyingOtp = false
                                if (verified) {
                                    isOtpVerified = true
                                    isError = false
                                    statusMessage = "Number verified ho gaya!"
                                } else {
                                    isError = true
                                    statusMessage = "Galat OTP! Dobara check karein."
                                }
                            }
                        },
                        enabled = !isVerifyingOtp && otpInput.isNotEmpty(),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF16A34A)),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.height(56.dp)
                    ) {
                        if (isVerifyingOtp) {
                            CircularProgressIndicator(modifier = Modifier.size(18.dp), color = Color.White)
                        } else {
                            Text("Verify")
                        }
                    }
                }
            }

            OutlinedTextField(
                value = upiId,
                onValueChange = { upiId = it },
                label = { Text("UPI ID (QR Payment hetu)*") },
                placeholder = { Text("9876543210@paytm") },
                leadingIcon = { Icon(Icons.Default.QrCode, contentDescription = null) },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            if (statusMessage.isNotEmpty()) {
                Text(
                    text = statusMessage,
                    color = if (isError) MaterialTheme.colorScheme.error else Color(0xFF16A34A),
                    style = MaterialTheme.typography.bodySmall,
                    fontWeight = FontWeight.SemiBold
                )
            }

            Spacer(Modifier.weight(1f))

            Button(
                onClick = {
                    if (name.isBlank() || shopName.isBlank() || city.isBlank() || phone.length != 10 || upiId.isBlank()) {
                        statusMessage = "Kripya sabhi fields dhyan se bharein."
                        isError = true
                        return@Button
                    }
                    if (!isOtpVerified) {
                        statusMessage = "Pehle OTP verify karein."
                        isError = true
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
                enabled = !isSubmitting && isOtpVerified,
                modifier = Modifier.fillMaxWidth().height(52.dp),
                shape = RoundedCornerShape(12.dp)
            ) {
                if (isSubmitting) {
                    CircularProgressIndicator(modifier = Modifier.size(22.dp), color = Color.White)
                } else {
                    Text("Register & Shuru Karein", fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

// 2Factor.in Send OTP API call
private fun send2FactorOtp(phone: String): Pair<Boolean, String> {
    return try {
        val urlStr = "https://2factor.in/v1/API/V1/$TWO_FACTOR_API_KEY/SMS/$phone/AUTOGEN/OTP1"
        val conn = URL(urlStr).openConnection() as HttpURLConnection
        conn.requestMethod = "GET"
        conn.connectTimeout = 8000
        conn.readTimeout = 8000

        val code = conn.responseCode
        val stream = if (code in 200..299) conn.inputStream else conn.errorStream
        val response = BufferedReader(InputStreamReader(stream)).use { it.readText() }
        conn.disconnect()

        val json = JSONObject(response)
        if (json.optString("Status") == "Success") {
            Pair(true, json.optString("Details")) // Details contains Session ID
        } else {
            Pair(false, json.optString("Details", "OTP bhejne me dikkat aayi"))
        }
    } catch (e: Exception) {
        Pair(false, "Connection error: ${e.localizedMessage}")
    }
}

// 2Factor.in Verify OTP API call
private fun verify2FactorOtp(sessionId: String, otp: String): Boolean {
    return try {
        val urlStr = "https://2factor.in/v1/API/V1/$TWO_FACTOR_API_KEY/SMS/VERIFY/$sessionId/$otp"
        val conn = URL(urlStr).openConnection() as HttpURLConnection
        conn.requestMethod = "GET"
        conn.connectTimeout = 8000
        conn.readTimeout = 8000

        val code = conn.responseCode
        val stream = if (code in 200..299) conn.inputStream else conn.errorStream
        val response = BufferedReader(InputStreamReader(stream)).use { it.readText() }
        conn.disconnect()

        val json = JSONObject(response)
        json.optString("Status") == "Success" && json.optString("Details") == "OTP Matched"
    } catch (_: Exception) {
        false
    }
}

// Google Sheet Sync Function
private fun syncUserRegistrationToServer(name: String, shop: String, city: String, phone: String, upi: String) {
    try {
        val scriptUrl = "https://script.google.com/macros/s/AKfycbzCE3WC2_470jzFwUa5yuApsfF-03QMoReXiJDqP8xvtEiOsp5CvVPUf2o-BylT26M7bQ/exec"
        val params = "name=${URLEncoder.encode(name, "UTF-8")}&shop=${URLEncoder.encode(shop, "UTF-8")}&city=${URLEncoder.encode(city, "UTF-8")}&phone=${URLEncoder.encode(phone, "UTF-8")}&upi=${URLEncoder.encode(upi, "UTF-8")}"
        
        var currentUrl = URL("$scriptUrl?$params")
        var redirects = 0
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
    } catch (_: Exception) {}
}
