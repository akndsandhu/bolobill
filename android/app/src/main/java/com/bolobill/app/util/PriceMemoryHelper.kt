package com.bolobill.app.util

import android.content.Context

object PriceMemoryHelper {
    private const val PREFS_NAME = "bolobill_price_memory"

    fun rememberItemPrice(context: Context, itemName: String, rate: Double, unit: String) {
        if (itemName.isBlank() || rate <= 0) return
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val key = itemName.trim().lowercase()
        prefs.edit().putString(key, "$rate|$unit").apply()
    }

    fun getRememberedPrice(context: Context, itemName: String): Pair<Double, String>? {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val key = itemName.trim().lowercase()
        val saved = prefs.getString(key, null) ?: return null
        val parts = saved.split("|")
        return if (parts.size == 2) {
            val rate = parts[0].toDoubleOrNull() ?: 0.0
            val unit = parts[1]
            Pair(rate, unit)
        } else null
    }
}
