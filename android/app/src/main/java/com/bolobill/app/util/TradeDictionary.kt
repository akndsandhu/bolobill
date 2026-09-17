package com.bolobill.app.util

import java.util.Locale
import java.util.regex.Pattern

object TradeDictionary {
    enum class LanguageMode { HINGLISH, ENGLISH }

    data class TradeItemDefinition(
        val devanagariKeywords: List<String>,
        val hinglishKeywords: List<String>,
        val englishProfessional: String,
        val hinglishColloquial: String,
        val defaultRate: Double,
        val standardUnit: String,
        val tradeCategory: String
    )

    private val DICTIONARY = listOf(
        // ==================== ELECTRICAL TRADES ====================
        TradeItemDefinition(
            devanagariKeywords = listOf("पंखा", "पंखे", "सीलिंग फैन", "छत का पंखा"),
            hinglishKeywords = listOf("pankha", "pankhe", "fan", "ceiling fan"),
            englishProfessional = "Ceiling Fan",
            hinglishColloquial = "Ceiling Fan Fitting",
            defaultRate = 350.0,
            standardUnit = "nos",
            tradeCategory = "Electrical"
        ),
        TradeItemDefinition(
            devanagariKeywords = listOf("तार", "वायर", "वायरिंग", "केबल"),
            hinglishKeywords = listOf("taar", "tar", "wire", "cable", "wiring"),
            englishProfessional = "Electrical Wiring",
            hinglishColloquial = "Taar Wiring",
            defaultRate = 450.0,
            standardUnit = "coil",
            tradeCategory = "Electrical"
        ),
        TradeItemDefinition(
            devanagariKeywords = listOf("स्विच", "बोर्ड", "प्लग", "सॉकेट", "स्विच बोर्ड"),
            hinglishKeywords = listOf("switch", "switch board", "switchboard", "board", "plug", "socket"),
            englishProfessional = "Modular Switch Board",
            hinglishColloquial = "Switch Board Fitting",
            defaultRate = 180.0,
            standardUnit = "nos",
            tradeCategory = "Electrical"
        ),
        TradeItemDefinition(
            devanagariKeywords = listOf("एमसीबी", "एमसीबी बॉक्स", "कट आउट", "ट्रिप स्विच"),
            hinglishKeywords = listOf("mcb", "mcb box", "cutout", "trip switch"),
            englishProfessional = "MCB Circuit Breaker",
            hinglishColloquial = "MCB Box Fitting",
            defaultRate = 450.0,
            standardUnit = "nos",
            tradeCategory = "Electrical"
        ),
        TradeItemDefinition(
            devanagariKeywords = listOf("लाइट", "बल्ब", "ट्यूबलाइट", "एलईडी", "होल्डर"),
            hinglishKeywords = listOf("light", "bulb", "tubelight", "led", "cfl", "holder"),
            englishProfessional = "LED Fixture & Tubelight",
            hinglishColloquial = "Light Fitting",
            defaultRate = 150.0,
            standardUnit = "nos",
            tradeCategory = "Electrical"
        ),

        // ==================== PLUMBING TRADES ====================
        TradeItemDefinition(
            devanagariKeywords = listOf("नल", "टोटी", "टैप", "बिब कॉक"),
            hinglishKeywords = listOf("nal", "toti", "tap", "bib cock", "water tap"),
            englishProfessional = "Brass / Chrome Water Tap",
            hinglishColloquial = "Tap Fitting",
            defaultRate = 250.0,
            standardUnit = "nos",
            tradeCategory = "Plumbing"
        ),
        TradeItemDefinition(
            devanagariKeywords = listOf("पाइप", "प्लंबिंग", "पीवीसी पाइप", "सीपीवीसी पाइप", "वाटर पाइप"),
            hinglishKeywords = listOf("pipe", "pvc pipe", "cpvc pipe", "water pipe", "plumbing pipe"),
            englishProfessional = "PVC / Copper Piping",
            hinglishColloquial = "Piping Line Work",
            defaultRate = 350.0,
            standardUnit = "ft",
            tradeCategory = "Plumbing"
        ),
        TradeItemDefinition(
            devanagariKeywords = listOf("टंकी", "वाटर टैंक", "फ्लश", "सिस्टर्न"),
            hinglishKeywords = listOf("tanki", "tank", "water tank", "flush", "cistern"),
            englishProfessional = "Water Tank & Flush Repair",
            hinglishColloquial = "Tanki Repair Work",
            defaultRate = 650.0,
            standardUnit = "job",
            tradeCategory = "Plumbing"
        ),
        TradeItemDefinition(
            devanagariKeywords = listOf("बेसिन", "वाश बेसिन", "सिंक", "नाली"),
            hinglishKeywords = listOf("basin", "wash basin", "washbasin", "sink", "drain", "nali"),
            englishProfessional = "Wash Basin & Sink Fitting",
            hinglishColloquial = "Basin Fitting Work",
            defaultRate = 400.0,
            standardUnit = "nos",
            tradeCategory = "Plumbing"
        ),

        // ==================== CARPENTRY TRADES ====================
        TradeItemDefinition(
            devanagariKeywords = listOf("दरवाजा", "किवाड़", "डोर", "चौखट"),
            hinglishKeywords = listOf("darwaza", "darwaja", "door", "chaukhat", "kivaad"),
            englishProfessional = "Door Fitting & Alignment",
            hinglishColloquial = "Darwaza Fitting",
            defaultRate = 500.0,
            standardUnit = "nos",
            tradeCategory = "Carpentry"
        ),
        TradeItemDefinition(
            devanagariKeywords = listOf("अलमारी", "वार्डरोब", "कपाट", "कबर्ड"),
            hinglishKeywords = listOf("almari", "almirah", "wardrobe", "cupboard", "kapat"),
            englishProfessional = "Wooden Wardrobe Work",
            hinglishColloquial = "Almari Work",
            defaultRate = 800.0,
            standardUnit = "job",
            tradeCategory = "Carpentry"
        ),
        TradeItemDefinition(
            devanagariKeywords = listOf("ताला", "लॉक", "हैंडल", "कब्ज़ा"),
            hinglishKeywords = listOf("tala", "lock", "handle", "kabza", "hinge", "hinges"),
            englishProfessional = "Lock & Hinges Fitting",
            hinglishColloquial = "Tala Kabza Fitting",
            defaultRate = 250.0,
            standardUnit = "nos",
            tradeCategory = "Carpentry"
        ),
        TradeItemDefinition(
            devanagariKeywords = listOf("प्लाई", "प्लाईवुड", "फर्नीचर", "टेबल", "कुर्सी"),
            hinglishKeywords = listOf("ply", "plywood", "furniture", "table", "kursi"),
            englishProfessional = "Plywood & Furniture Repair",
            hinglishColloquial = "Furniture Work",
            defaultRate = 450.0,
            standardUnit = "job",
            tradeCategory = "Carpentry"
        ),

        // ==================== GENERAL LABOUR ====================
        TradeItemDefinition(
            devanagariKeywords = listOf("फिटिंग", "लगाना", "फिक्सिंग", "मरम्मत"),
            hinglishKeywords = listOf("fitting", "lagana", "lagai", "fixing", "installation", "marammat"),
            englishProfessional = "Installation & Fitting",
            hinglishColloquial = "Fitting Work",
            defaultRate = 250.0,
            standardUnit = "job",
            tradeCategory = "General"
        )
    )

    fun normalizeTerm(rawText: String, targetLanguage: LanguageMode): String {
        val clean = rawText.trim().lowercase(Locale.ROOT)
        for (item in DICTIONARY) {
            if (item.hinglishKeywords.any { clean.contains(it) } || 
                item.devanagariKeywords.any { clean.contains(it) }) {
                return if (targetLanguage == LanguageMode.ENGLISH) item.englishProfessional else item.hinglishColloquial
            }
        }
        return rawText.replaceFirstChar { if (it.isLowerCase()) it.titlecase(Locale.ROOT) else it.toString() }
    }

    fun parseSpokenUtterance(spokenText: String, targetLanguage: LanguageMode): List<ParsedItem> {
        val result = mutableListOf<ParsedItem>()
        val segments = spokenText.split(Regex("""(?i)\b(aur|and|plus|bhi|va|tatha|,)\b"""))
        
        for (seg in segments) {
            val trimmed = seg.trim()
            if (trimmed.isEmpty()) continue

            val matcher = Pattern.compile("""\d+""").matcher(trimmed)
            val numbers = mutableListOf<Int>()
            while (matcher.find()) {
                matcher.group().toIntOrNull()?.let { numbers.add(it) }
            }

            var qty = 1
            var rate = 0.0
            if (numbers.size == 1) {
                if (numbers[0] > 50) rate = numbers[0].toDouble() else qty = numbers[0]
            } else if (numbers.size >= 2) {
                qty = numbers[0]
                rate = numbers[1].toDouble()
            }

            val lower = trimmed.lowercase(Locale.ROOT)
            val matchedDef = DICTIONARY.firstOrNull { item ->
                item.hinglishKeywords.any { lower.contains(it) } ||
                item.devanagariKeywords.any { lower.contains(it) }
            }

            if (matchedDef != null) {
                if (rate == 0.0) rate = matchedDef.defaultRate
                val itemName = if (targetLanguage == LanguageMode.ENGLISH) matchedDef.englishProfessional else matchedDef.hinglishColloquial
                result.add(ParsedItem(itemName, qty, matchedDef.standardUnit, rate, qty * rate))
            } else {
                val cleanedName = trimmed.replace(Regex("""\d+"""), "").trim()
                val finalName = cleanedName.ifEmpty { "Service Work" }
                val finalRate = if (rate > 0.0) rate else 250.0
                result.add(ParsedItem(finalName, qty, "nos", finalRate, qty * finalRate))
            }
        }
        return result
    }

    data class ParsedItem(
        val name: String,
        val quantity: Int,
        val unit: String,
        val rate: Double,
        val amount: Double
    )
}
