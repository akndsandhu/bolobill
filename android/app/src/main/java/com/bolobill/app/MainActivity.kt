package com.bolobill.app

import android.content.Context
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import com.bolobill.app.data.model.Invoice
import com.bolobill.app.ui.screens.*

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val prefs = remember { getSharedPreferences("bolobill_prefs", Context.MODE_PRIVATE) }
            val isRegistered = prefs.getBoolean("is_registered", false)

            var currentScreen by remember { mutableStateOf("SPLASH") }

            var shopName by remember { mutableStateOf(prefs.getString("shop_name", "मेरी दुकान") ?: "मेरी दुकान") }
            var shopPhone by remember { mutableStateOf(prefs.getString("phone", "") ?: "") }
            var shopCity by remember { mutableStateOf(prefs.getString("city", "") ?: "") }
            var shopUpi by remember { mutableStateOf(prefs.getString("upi_id", "") ?: "") }

            var currentInvoice by remember {
                mutableStateOf(
                    Invoice(
                        id = "inv_${System.currentTimeMillis()}",
                        invoiceNumber = "BB-${System.currentTimeMillis().toString().takeLast(4)}",
                        clientName = "",
                        clientPhone = "",
                        clientAddress = "",
                        technicianName = shopName,
                        technicianPhone = shopPhone,
                        technicianTrade = shopCity,
                        technicianUpiId = shopUpi,
                        items = emptyList(),
                        subtotal = 0.0,
                        totalAmount = 0.0
                    )
                )
            }

            when (currentScreen) {
                "SPLASH" -> {
                    SplashScreen(
                        isRegistered = isRegistered,
                        onNavigateNext = { target -> currentScreen = target }
                    )
                }
                "ONBOARDING" -> {
                    OnboardingScreen(
                        onRegistrationComplete = { _, shop, city, phone, upi ->
                            shopName = shop
                            shopCity = city
                            shopPhone = phone
                            shopUpi = upi
                            currentInvoice = currentInvoice.copy(
                                technicianName = shop,
                                technicianPhone = phone,
                                technicianTrade = city,
                                technicianUpiId = upi
                            )
                            currentScreen = "BUILDER"
                        }
                    )
                }
                "SETTINGS" -> {
                    ProfileSettingsScreen(
                        onBack = { currentScreen = "BUILDER" },
                        onSaved = { shop, phone, city, upi ->
                            shopName = shop
                            shopCity = city
                            shopPhone = phone
                            shopUpi = upi
                            currentInvoice = currentInvoice.copy(
                                technicianName = shop,
                                technicianPhone = phone,
                                technicianTrade = city,
                                technicianUpiId = upi
                            )
                        }
                    )
                }
                "PREVIEW" -> {
                    PdfPreviewScreen(
                        invoice = currentInvoice,
                        onInvoiceUpdated = { currentInvoice = it },
                        onBack = { currentScreen = "BUILDER" }
                    )
                }
                else -> {
                    BillBuilderScreen(
                        currentInvoice = currentInvoice,
                        onSaveInvoice = { currentInvoice = it },
                        onNavigateToPreview = {
                            currentInvoice = it
                            currentScreen = "PREVIEW"
                        }
                    )
                }
            }
        }
    }
}
