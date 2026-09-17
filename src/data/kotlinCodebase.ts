import { KotlinFileEntry } from '../types';

export const KOTLIN_DELIVERABLES: KotlinFileEntry[] = [
  {
    id: 'trade_dictionary',
    filename: 'TradeDictionary.kt',
    path: 'app/src/main/java/com/bolobill/app/util/TradeDictionary.kt',
    badge: 'Offline NLP Engine',
    description: 'Offline Hinglish-to-English normalizer and phonetic trade mapper for spoken voice quotation parsing.',
    code: `package com.bolobill.app.util

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
`,
  },
  {
    id: 'photo_picker_helper',
    filename: 'PhotoPickerHelper.kt',
    path: 'app/src/main/java/com/bolobill/app/util/PhotoPickerHelper.kt',
    badge: 'Play Store Zero-Permission',
    description: 'Compose Photo Picker implementation using PickVisualMedia with scoped storage persistence, automatic EXIF orientation rotation, and memory-safe compression.',
    code: `package com.bolobill.app.util

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Matrix
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AddAPhoto
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.exifinterface.media.ExifInterface
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.ByteArrayInputStream
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import java.util.UUID

/**
 * PhotoPickerHelper: Google Play Store Policy Compliant Work Proof Manager.
 *
 * CRITICAL COMPLIANCE & EXIF HANDLING:
 * - Uses ActivityResultContracts.PickVisualMedia (Android Photo Picker).
 * - ZERO READ_MEDIA_IMAGES / READ_EXTERNAL_STORAGE permissions requested.
 * - Safely copies content:// URI into App's internal scoped storage (context.cacheDir/work_proofs).
 * - Downsamples large camera bitmaps into 480x360 targets to prevent OutOfMemory crashes.
 * - Automatically reads EXIF orientation tags and rotates portrait/landscape photos upright before saving,
 *   preventing vertical photos from rendering sideways on the A4 PDF invoice.
 */
object PhotoPickerHelper {

    /**
     * Saves chosen photo to app-internal cache directory and returns the local absolute URI.
     * Automatically handles EXIF rotation to ensure vertical photos do not render sideways.
     */
    suspend fun persistWorkProofLocally(context: Context, sourceUri: Uri, prefix: String): String? =
        withContext(Dispatchers.IO) {
            try {
                val directory = File(context.cacheDir, "work_proofs").apply { if (!exists()) mkdirs() }
                val targetFile = File(directory, "\${prefix}_\${UUID.randomUUID()}.jpg")

                context.contentResolver.openInputStream(sourceUri)?.use { input ->
                    // First decode bounds only for downsampling calculation
                    val options = BitmapFactory.Options().apply { inJustDecodeBounds = true }
                    val bytes = input.readBytes()
                    BitmapFactory.decodeByteArray(bytes, 0, bytes.size, options)

                    // Target 480x360 for high quality print without wasting RAM
                    options.inSampleSize = calculateInSampleSize(options, reqWidth = 480, reqHeight = 360)
                    options.inJustDecodeBounds = false

                    val rawBitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.size, options)
                    if (rawBitmap != null) {
                        val orientedBitmap = rotateBitmapIfRequired(rawBitmap, bytes)
                        FileOutputStream(targetFile).use { out ->
                            orientedBitmap.compress(Bitmap.CompressFormat.JPEG, 85, out)
                        }
                        if (orientedBitmap != rawBitmap) {
                            orientedBitmap.recycle()
                        }
                        return@withContext Uri.fromFile(targetFile).toString()
                    }
                }
                null
            } catch (e: Exception) {
                e.printStackTrace()
                null
            }
        }

    /**
     * Inspects EXIF metadata from raw image bytes and returns the correctly rotated Bitmap.
     * Prevents vertical smartphone photos from rendering sideways or upside-down on the A4 invoice.
     */
    fun rotateBitmapIfRequired(bitmap: Bitmap, imageBytes: ByteArray): Bitmap {
        return try {
            val exif = ExifInterface(ByteArrayInputStream(imageBytes))
            val orientation = exif.getAttributeInt(
                ExifInterface.TAG_ORIENTATION,
                ExifInterface.ORIENTATION_NORMAL
            )
            applyExifOrientation(bitmap, orientation)
        } catch (e: Exception) {
            bitmap
        }
    }

    /**
     * Inspects EXIF metadata from an InputStream and returns the correctly rotated Bitmap.
     */
    fun rotateBitmapIfRequired(bitmap: Bitmap, inputStream: InputStream): Bitmap {
        return try {
            val exif = ExifInterface(inputStream)
            val orientation = exif.getAttributeInt(
                ExifInterface.TAG_ORIENTATION,
                ExifInterface.ORIENTATION_NORMAL
            )
            applyExifOrientation(bitmap, orientation)
        } catch (e: Exception) {
            bitmap
        }
    }

    /**
     * Applies rotation / flip matrix corresponding to the EXIF orientation tag.
     */
    private fun applyExifOrientation(bitmap: Bitmap, orientation: Int): Bitmap {
        val matrix = Matrix()
        when (orientation) {
            ExifInterface.ORIENTATION_ROTATE_90 -> matrix.postRotate(90f)
            ExifInterface.ORIENTATION_ROTATE_180 -> matrix.postRotate(180f)
            ExifInterface.ORIENTATION_ROTATE_270 -> matrix.postRotate(270f)
            ExifInterface.ORIENTATION_FLIP_HORIZONTAL -> matrix.postScale(-1f, 1f)
            ExifInterface.ORIENTATION_FLIP_VERTICAL -> matrix.postScale(1f, -1f)
            ExifInterface.ORIENTATION_TRANSPOSE -> {
                matrix.postRotate(90f)
                matrix.postScale(-1f, 1f)
            }
            ExifInterface.ORIENTATION_TRANSVERSE -> {
                matrix.postRotate(270f)
                matrix.postScale(-1f, 1f)
            }
            else -> return bitmap
        }

        return try {
            val rotated = Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true)
            if (rotated != bitmap) {
                bitmap.recycle()
            }
            rotated
        } catch (e: OutOfMemoryError) {
            bitmap
        }
    }

    fun calculateInSampleSize(options: BitmapFactory.Options, reqWidth: Int, reqHeight: Int): Int {
        val (height: Int, width: Int) = options.outHeight to options.outWidth
        var inSampleSize = 1

        if (height > reqHeight || width > reqWidth) {
            val halfHeight: Int = height / 2
            val halfWidth: Int = width / 2
            while ((halfHeight / inSampleSize) >= reqHeight && (halfWidth / inSampleSize) >= reqWidth) {
                inSampleSize *= 2
            }
        }
        return inSampleSize
    }
}

/**
 * Reusable Composable Slot for Work Proof Photos.
 */
@Composable
fun WorkProofThumbnailSlot(
    title: String,
    photoUri: String?,
    onPhotoSelected: (String?) -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    var isProcessing by remember { mutableStateOf(false) }

    // Android Native Photo Picker Launcher
    val pickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickVisualMedia()
    ) { uri: Uri? ->
        if (uri != null) {
            isProcessing = true
            coroutineScope.run {
                kotlinx.coroutines.launch(Dispatchers.IO) {
                    val localUri = PhotoPickerHelper.persistWorkProofLocally(
                        context = context,
                        sourceUri = uri,
                        prefix = title.lowercase().replace(" ", "_")
                    )
                    withContext(Dispatchers.Main) {
                        onPhotoSelected(localUri)
                        isProcessing = false
                    }
                }
            }
        }
    }

    // Load bitmap for thumbnail preview
    var thumbnailBitmap by remember(photoUri) { mutableStateOf<Bitmap?>(null) }
    LaunchedEffect(photoUri) {
        if (photoUri != null) {
            withContext(Dispatchers.IO) {
                try {
                    val fileUri = Uri.parse(photoUri)
                    val stream = if (fileUri.scheme == "file") {
                        File(fileUri.path ?: "").inputStream()
                    } else {
                        context.contentResolver.openInputStream(fileUri)
                    }
                    thumbnailBitmap = stream?.use { BitmapFactory.decodeStream(it) }
                } catch (e: Exception) {
                    thumbnailBitmap = null
                }
            }
        } else {
            thumbnailBitmap = null
        }
    }

    Card(
        modifier = modifier
            .fillMaxWidth()
            .height(110.dp)
            .clip(RoundedCornerShape(12.dp))
            .border(
                width = 1.dp,
                color = if (photoUri != null) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outlineVariant,
                shape = RoundedCornerShape(12.dp)
            )
            .clickable {
                pickerLauncher.launch(
                    PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)
                )
            },
        colors = CardDefaults.cardColors(
            containerColor = if (photoUri != null) MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.15f)
            else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f)
        )
    ) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            if (isProcessing) {
                CircularProgressIndicator(modifier = Modifier.size(24.dp))
            } else if (thumbnailBitmap != null) {
                Image(
                    bitmap = thumbnailBitmap!!.asImageBitmap(),
                    contentDescription = title,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
                // Remove / Clear Overlay Button
                IconButton(
                    onClick = { onPhotoSelected(null) },
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(4.dp)
                        .size(28.dp)
                        .background(Color.Black.copy(alpha = 0.6f), RoundedCornerShape(14.dp))
                ) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Remove Photo",
                        tint = Color.White,
                        modifier = Modifier.size(16.dp)
                    )
                }
                // Caption Tag
                Surface(
                    color = Color.Black.copy(alpha = 0.7f),
                    shape = RoundedCornerShape(topEnd = 8.dp),
                    modifier = Modifier.align(Alignment.BottomStart)
                ) {
                    Text(
                        text = title,
                        style = MaterialTheme.typography.labelSmall,
                        color = Color.White,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                    )
                }
            } else {
                Column(horizontalAlignment = Alignment.CenterAlignment) {
                    Icon(
                        imageVector = Icons.Default.AddAPhoto,
                        contentDescription = "Pick Photo",
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(26.dp)
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = title,
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = "Tap to choose",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.outline
                    )
                }
            }
        }
    }
}
`,
  },
  {
    id: 'pdf_generator',
    filename: 'PdfGenerator.kt',
    path: 'app/src/main/java/com/bolobill/app/pdf/PdfGenerator.kt',
    badge: 'A4 Vector PDF Canvas',
    description: 'Scoped Storage PDF generator with Before/After 120x90dp photos, circular guarantee stamp, and diagonal PAID watermark.',
    code: `package com.bolobill.app.pdf

import android.content.Context
import android.graphics.*
import android.graphics.pdf.PdfDocument
import android.net.Uri
import com.bolobill.app.data.model.Invoice
import com.bolobill.app.util.PhotoPickerHelper
import com.google.zxing.BarcodeFormat
import com.google.zxing.qrcode.QRCodeWriter
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream
import java.net.URLEncoder
import java.text.SimpleDateFormat
import java.util.*

/**
 * PdfGenerator: Generates High-Resolution A4 PDFs on native Android Canvas.
 *
 * FEATURES IMPLEMENTED:
 * 1. Dynamic UPI QR Generator (ZXing QRCodeWriter) for instant client scan-to-pay.
 * 2. Dynamic Y calculation (getDynamicPhotoY) to prevent item and summary overlap.
 * 3. Before & After Bitmaps:
 *    - Memory-safe bitmap decoding with inSampleSize to prevent OOM.
 * 4. Service Guarantee / Warranty Badge:
 *    - Circular vector stamp: "BOLOBILL VERIFIED • [X] DAYS SERVICE GUARANTEE".
 * 5. Instant Payment Receipt Mode:
 *    - Renders diagonal semi-transparent green watermark: "PAID / पूर्ण भुगतान प्राप्त" across center.
 *    - Suppresses UPI QR Code when invoice is marked as paid, replacing with clearance timestamp.
 * 6. Scoped Storage:
 *    - Output strictly saved into context.cacheDir/invoices/ for FileProvider sharing.
 */
object PdfGenerator {

    // A4 Standard Dimensions at 72 DPI (Points)
    private const val PAGE_WIDTH = 595
    private const val PAGE_HEIGHT = 842

    // Dynamic QR Generator Function
    private fun generateUpiQrBitmap(upiUri: String, size: Int = 250): Bitmap? {
        return try {
            val bitMatrix = QRCodeWriter().encode(upiUri, BarcodeFormat.QR_CODE, size, size)
            val width = bitMatrix.width
            val height = bitMatrix.height
            val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.RGB_565)
            for (x in 0 until width) {
                for (y in 0 until height) {
                    bitmap.setPixel(x, y, if (bitMatrix.get(x, y)) Color.BLACK else Color.WHITE)
                }
            }
            bitmap
        } catch (e: Exception) {
            null
        }
    }

    // Dynamic Y calculation helper to prevent item overlap
    fun getDynamicPhotoY(itemsCount: Int): Float {
        val baseTableY = 206f
        val tableHeight = itemsCount * 24f
        val calculatedY = baseTableY + tableHeight + 80f // 80pt margin for totals
        return maxOf(calculatedY, 520f)
    }

    suspend fun generateInvoicePdf(context: Context, invoice: Invoice): File =
        withContext(Dispatchers.IO) {
            val pdfDoc = PdfDocument()
            val pageInfo = PdfDocument.PageInfo.Builder(PAGE_WIDTH, PAGE_HEIGHT, 1).create()
            val page = pdfDoc.startPage(pageInfo)
            val canvas = page.canvas

            // 1. Background Fill
            canvas.drawColor(Color.WHITE)

            // Paint Setup
            val headerPaint = Paint().apply {
                isAntiAlias = true
                color = Color.rgb(17, 28, 45) // Deep Navy
                typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                textSize = 22f
            }

            val accentPaint = Paint().apply {
                isAntiAlias = true
                color = Color.rgb(20, 110, 245) // Electric Blue
            }

            val textPaint = Paint().apply {
                isAntiAlias = true
                color = Color.rgb(55, 65, 81)
                textSize = 10f
            }

            // Top Color Bar
            canvas.drawRect(0f, 0f, PAGE_WIDTH.toFloat(), 8f, accentPaint)

            // 2. Header: Business Title & Invoice Details
            canvas.drawText("BOLOBILL INVOICE", 40f, 42f, headerPaint)

            val metaPaint = Paint().apply {
                isAntiAlias = true
                color = Color.rgb(100, 116, 139)
                textSize = 9.5f
            }
            canvas.drawText("Invoice #: \${invoice.invoiceNumber}", 40f, 58f, metaPaint)
            val dateFormat = SimpleDateFormat("dd MMM yyyy, hh:mm a", Locale.getDefault())
            canvas.drawText("Date: \${dateFormat.format(Date(invoice.createdAt))}", 40f, 72f, metaPaint)

            // Technician / Trade Badge
            val techBox = RectF(PAGE_WIDTH - 220f, 25f, PAGE_WIDTH - 40f, 85f)
            val techBoxPaint = Paint().apply {
                color = Color.rgb(241, 245, 249)
                style = Paint.Style.FILL
            }
            canvas.drawRoundRect(techBox, 8f, 8f, techBoxPaint)

            val techTitlePaint = Paint().apply {
                isAntiAlias = true
                color = Color.rgb(15, 23, 42)
                typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                textSize = 11f
            }
            canvas.drawText(invoice.technicianName, PAGE_WIDTH - 210f, 45f, techTitlePaint)
            canvas.drawText(invoice.technicianTrade, PAGE_WIDTH - 210f, 60f, metaPaint)
            canvas.drawText("UPI: \${invoice.technicianUpiId}", PAGE_WIDTH - 210f, 75f, metaPaint)

            // 3. Client Information Box
            val clientBox = RectF(40f, 98f, PAGE_WIDTH - 40f, 155f)
            val clientBoxPaint = Paint().apply {
                color = Color.rgb(248, 250, 252)
                style = Paint.Style.FILL
            }
            canvas.drawRoundRect(clientBox, 8f, 8f, clientBoxPaint)

            val clientTitlePaint = Paint().apply {
                isAntiAlias = true
                color = Color.rgb(100, 116, 139)
                textSize = 8.5f
                typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            }
            canvas.drawText("BILLED TO / सेवा प्राप्तकर्ता", 52f, 114f, clientTitlePaint)

            val clientNamePaint = Paint().apply {
                isAntiAlias = true
                color = Color.rgb(15, 23, 42)
                textSize = 12f
                typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            }
            canvas.drawText(invoice.clientName, 52f, 130f, clientNamePaint)
            canvas.drawText("\${invoice.clientPhone} • \${invoice.clientAddress}", 52f, 145f, textPaint)

            // 4. Line Items Table
            var currentY = 180f
            val tableHeaderPaint = Paint().apply {
                color = Color.rgb(226, 232, 240)
                style = Paint.Style.FILL
            }
            canvas.drawRect(40f, currentY, PAGE_WIDTH - 40f, currentY + 22f, tableHeaderPaint)

            val colPaint = Paint().apply {
                isAntiAlias = true
                color = Color.rgb(30, 41, 59)
                textSize = 9f
                typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            }
            canvas.drawText("SL", 50f, currentY + 14f, colPaint)
            canvas.drawText("ITEM DESCRIPTION / विवरण", 85f, currentY + 14f, colPaint)
            canvas.drawText("QTY", 360f, currentY + 14f, colPaint)
            canvas.drawText("RATE (₹)", 420f, currentY + 14f, colPaint)
            canvas.drawText("AMOUNT (₹)", 480f, currentY + 14f, colPaint)

            currentY += 26f

            val rowTextPaint = Paint().apply {
                isAntiAlias = true
                color = Color.rgb(51, 65, 85)
                textSize = 9.5f
            }
            val dividerPaint = Paint().apply {
                color = Color.rgb(241, 245, 249)
                strokeWidth = 1f
            }

            invoice.items.forEachIndexed { index, item ->
                canvas.drawText("\${index + 1}", 50f, currentY + 14f, rowTextPaint)
                canvas.drawText(item.name, 85f, currentY + 14f, rowTextPaint)
                canvas.drawText("\${item.quantity} \${item.unit}", 360f, currentY + 14f, rowTextPaint)
                canvas.drawText(String.format(Locale.ROOT, "%.2f", item.rate), 420f, currentY + 14f, rowTextPaint)
                canvas.drawText(String.format(Locale.ROOT, "%.2f", item.amount), 480f, currentY + 14f, rowTextPaint)

                canvas.drawLine(40f, currentY + 22f, PAGE_WIDTH - 40f, currentY + 22f, dividerPaint)
                currentY += 24f
            }

            // Total Summary Section
            currentY += 10f
            val totalBoxX = PAGE_WIDTH - 240f
            canvas.drawText("Subtotal:", totalBoxX, currentY, textPaint)
            canvas.drawText("₹ \${String.format(Locale.ROOT, "%.2f", invoice.subtotal)}", totalBoxX + 110f, currentY, textPaint)

            if (invoice.discount > 0) {
                currentY += 16f
                canvas.drawText("Discount:", totalBoxX, currentY, textPaint)
                canvas.drawText("- ₹ \${String.format(Locale.ROOT, "%.2f", invoice.discount)}", totalBoxX + 110f, currentY, textPaint)
            }

            currentY += 22f
            val grandTotalPaint = Paint().apply {
                isAntiAlias = true
                color = Color.rgb(15, 23, 42)
                textSize = 14f
                typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            }
            canvas.drawText("Total Payable:", totalBoxX, currentY, grandTotalPaint)
            val grandPricePaint = Paint().apply {
                isAntiAlias = true
                color = Color.rgb(16, 185, 129) // Emerald Green
                textSize = 15f
                typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            }
            canvas.drawText("₹ \${String.format(Locale.ROOT, "%.2f", invoice.totalAmount)}", totalBoxX + 110f, currentY, grandPricePaint)

            // 5. Service Guarantee / Warranty Badge (if selected)
            if (!invoice.warrantyTerm.isNullOrEmpty() && invoice.warrantyTerm != "NO_WARRANTY") {
                val stampCenterX = 110f
                val stampCenterY = currentY - 15f
                drawCircularWarrantyStamp(canvas, stampCenterX, stampCenterY, invoice.warrantyTerm)
            }

            // 6. Before & After Work Proof Photos (Embedded side-by-side at bottom)
            val photoSectionY = getDynamicPhotoY(invoice.items.size)
            val photoSectionTitlePaint = Paint().apply {
                isAntiAlias = true
                color = Color.rgb(71, 85, 105)
                textSize = 9.5f
                typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            }
            canvas.drawText("VERIFIED WORK PROOF / कार्य प्रमाण फोटो:", 40f, photoSectionY - 8f, photoSectionTitlePaint)

            // Embed Before Photo (120x90 pt)
            val beforeBitmap = decodeSampledBitmapFromUri(context, invoice.beforePhotoUri, 160, 120)
            val photoBoxPaint = Paint().apply {
                color = Color.rgb(241, 245, 249)
                style = Paint.Style.FILL
            }
            val beforeRect = RectF(40f, photoSectionY, 160f, photoSectionY + 90f)
            canvas.drawRoundRect(beforeRect, 6f, 6f, photoBoxPaint)
            if (beforeBitmap != null) {
                canvas.drawBitmap(beforeBitmap, null, beforeRect, null)
            }
            drawPhotoCaption(canvas, "Work Before / कार्य से पहले", 40f, photoSectionY + 102f)

            // Embed After Photo (120x90 pt)
            val afterBitmap = decodeSampledBitmapFromUri(context, invoice.afterPhotoUri, 160, 120)
            val afterRect = RectF(180f, photoSectionY, 300f, photoSectionY + 90f)
            canvas.drawRoundRect(afterRect, 6f, 6f, photoBoxPaint)
            if (afterBitmap != null) {
                canvas.drawBitmap(afterBitmap, null, afterRect, null)
            }
            drawPhotoCaption(canvas, "Work Completed / कार्य सम्पन्न", 180f, photoSectionY + 102f)

            // 7. UPI QR Code or Clearance Stamp (Bottom Right)
            val qrBoxX = PAGE_WIDTH - 150f
            val qrBoxY = photoSectionY - 10f

            if (invoice.isPaid) {
                // Payment is CLEARED: Suppress QR Code, Show Clearance Box
                val paidBox = RectF(qrBoxX, qrBoxY, qrBoxX + 110f, qrBoxY + 110f)
                val paidBoxPaint = Paint().apply {
                    color = Color.rgb(240, 253, 244) // Light Mint
                    style = Paint.Style.FILL
                }
                val paidBorderPaint = Paint().apply {
                    color = Color.rgb(34, 197, 94)
                    style = Paint.Style.STROKE
                    strokeWidth = 1.5f
                }
                canvas.drawRoundRect(paidBox, 8f, 8f, paidBoxPaint)
                canvas.drawRoundRect(paidBox, 8f, 8f, paidBorderPaint)

                val paidReceiptTextPaint = Paint().apply {
                    isAntiAlias = true
                    color = Color.rgb(22, 101, 52)
                    textSize = 11f
                    typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                }
                canvas.drawText("PAYMENT", qrBoxX + 26f, qrBoxY + 38f, paidReceiptTextPaint)
                canvas.drawText("CLEARED", qrBoxX + 28f, qrBoxY + 54f, paidReceiptTextPaint)

                val clearDate = invoice.paidDate ?: System.currentTimeMillis()
                val clearDateStr = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault()).format(Date(clearDate))
                val dateLabelPaint = Paint().apply {
                    isAntiAlias = true
                    color = Color.rgb(74, 222, 128)
                    textSize = 8.5f
                }
                canvas.drawText(clearDateStr, qrBoxX + 28f, qrBoxY + 76f, dateLabelPaint)
            } else {
                // Payment PENDING: Draw UPI QR Code via ZXing
                val qrBox = RectF(qrBoxX, qrBoxY, qrBoxX + 110f, qrBoxY + 110f)
                val qrBgPaint = Paint().apply {
                    color = Color.rgb(248, 250, 252)
                    style = Paint.Style.FILL
                }
                canvas.drawRoundRect(qrBox, 8f, 8f, qrBgPaint)

                val upiUri = "upi://pay?pa=\${invoice.technicianUpiId}&pn=\${URLEncoder.encode(invoice.technicianName, \"UTF-8\")}&am=\${invoice.totalAmount}&cu=INR&tn=Bill_\${invoice.invoiceNumber}"
                val qrBitmap = generateUpiQrBitmap(upiUri, 200)

                if (qrBitmap != null) {
                    val qrDestRect = RectF(qrBoxX + 10f, qrBoxY + 10f, qrBoxX + 100f, qrBoxY + 100f)
                    canvas.drawBitmap(qrBitmap, null, qrDestRect, null)
                    val qrSubText = Paint().apply {
                        isAntiAlias = true
                        color = Color.rgb(71, 85, 105)
                        textSize = 7.5f
                        typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                    }
                    canvas.drawText("SCAN TO PAY (UPI)", qrBoxX + 18f, qrBoxY + 102f, qrSubText)
                } else {
                    val qrTextPaint = Paint().apply {
                        isAntiAlias = true
                        color = Color.rgb(71, 85, 105)
                        textSize = 9f
                        typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                    }
                    canvas.drawText("SCAN TO PAY", qrBoxX + 22f, qrBoxY + 58f, qrTextPaint)
                    val upiSubText = Paint().apply {
                        isAntiAlias = true
                        color = Color.rgb(100, 116, 139)
                        textSize = 7.5f
                    }
                    canvas.drawText("UPI / GooglePay / PhonePe", qrBoxX + 12f, qrBoxY + 76f, upiSubText)
                }
            }

            // 8. Diagonal Semi-Transparent Green Watermark ("PAID") if toggled
            if (invoice.isPaid) {
                drawPaidWatermark(canvas)
            }

            // Finish PDF Page
            pdfDoc.finishPage(page)

            // Save to Scoped Storage (context.cacheDir/invoices/)
            val outputDir = File(context.cacheDir, "invoices").apply { if (!exists()) mkdirs() }
            val outputFile = File(outputDir, "Invoice_\${invoice.invoiceNumber}.pdf")
            FileOutputStream(outputFile).use { out ->
                pdfDoc.writeTo(out)
            }
            pdfDoc.close()

            return@withContext outputFile
        }

    /**
     * Circular Warranty Stamp: "BOLOBILL VERIFIED • [X] DAYS SERVICE GUARANTEE" with shield.
     */
    private fun drawCircularWarrantyStamp(canvas: Canvas, cx: Float, cy: Float, warrantyTerm: String) {
        val daysCount = when (warrantyTerm) {
            "15_DAYS" -> "15"
            "30_DAYS" -> "30"
            "90_DAYS" -> "90"
            else -> "30"
        }

        val radius = 48f
        val stampPaint = Paint().apply {
            isAntiAlias = true
            color = Color.rgb(14, 116, 144) // Deep Cyan/Teal
            style = Paint.Style.STROKE
            strokeWidth = 2.5f
        }
        // Outer Circle
        canvas.drawCircle(cx, cy, radius, stampPaint)

        // Inner Dashed Circle
        val innerCirclePaint = Paint().apply {
            isAntiAlias = true
            color = Color.rgb(6, 182, 212)
            style = Paint.Style.STROKE
            strokeWidth = 1f
            pathEffect = DashPathEffect(floatArrayOf(4f, 3f), 0f)
        }
        canvas.drawCircle(cx, cy, radius - 6f, innerCirclePaint)

        // Text along Arc / Circle Path
        val textPath = Path().apply {
            addCircle(cx, cy, radius - 14f, Path.Direction.CW)
        }
        val arcTextPaint = Paint().apply {
            isAntiAlias = true
            color = Color.rgb(14, 116, 144)
            textSize = 6.2f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            letterSpacing = 0.08f
        }
        canvas.drawTextOnPath("BOLOBILL VERIFIED • SERVICE GUARANTEE", textPath, 18f, 0f, arcTextPaint)

        // Center Shield Text
        val daysNumberPaint = Paint().apply {
            isAntiAlias = true
            color = Color.rgb(8, 145, 178)
            textSize = 15f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        }
        canvas.drawText("$daysCount", cx - 8f, cy + 2f, daysNumberPaint)

        val daysSubPaint = Paint().apply {
            isAntiAlias = true
            color = Color.rgb(71, 85, 105)
            textSize = 6.5f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        }
        canvas.drawText("DAYS WARRANTY", cx - 24f, cy + 12f, daysSubPaint)
    }

    /**
     * Diagonal semi-transparent watermark across center of invoice.
     */
    private fun drawPaidWatermark(canvas: Canvas) {
        canvas.save()
        // Rotate canvas around page center
        canvas.rotate(-35f, PAGE_WIDTH / 2f, PAGE_HEIGHT / 2f)

        val watermarkPaint = Paint().apply {
            isAntiAlias = true
            color = Color.argb(42, 22, 163, 74) // 16% Opacity Green
            textSize = 54f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        }

        val hindiWatermarkPaint = Paint().apply {
            isAntiAlias = true
            color = Color.argb(38, 22, 163, 74)
            textSize = 22f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        }

        val borderPaint = Paint().apply {
            isAntiAlias = true
            color = Color.argb(48, 22, 163, 74)
            style = Paint.Style.STROKE
            strokeWidth = 4f
        }

        val rectWidth = 420f
        val rectHeight = 84f
        val rectLeft = (PAGE_WIDTH - rectWidth) / 2f
        val rectTop = (PAGE_HEIGHT - rectHeight) / 2f
        val stampRect = RectF(rectLeft, rectTop, rectLeft + rectWidth, rectTop + rectHeight)

        canvas.drawRoundRect(stampRect, 16f, 16f, borderPaint)
        canvas.drawText("PAID", rectLeft + 54f, rectTop + 58f, watermarkPaint)
        canvas.drawText("पूर्ण भुगतान प्राप्त", rectLeft + 200f, rectTop + 52f, hindiWatermarkPaint)

        canvas.restore()
    }

    private fun drawPhotoCaption(canvas: Canvas, caption: String, x: Float, y: Float) {
        val paint = Paint().apply {
            isAntiAlias = true
            color = Color.rgb(100, 116, 139)
            textSize = 7.5f
        }
        canvas.drawText(caption, x, y, paint)
    }

    /**
     * Downsamples Bitmap from URI preventing OutOfMemory on high-res camera captures.
     */
    private fun decodeSampledBitmapFromUri(context: Context, uriString: String?, reqWidth: Int, reqHeight: Int): Bitmap? {
        if (uriString.isNullOrEmpty()) return null
        return try {
            val uri = Uri.parse(uriString)
            val stream = if (uri.scheme == "file") {
                File(uri.path ?: "").inputStream()
            } else {
                context.contentResolver.openInputStream(uri)
            } ?: return null

            val bytes = stream.readBytes()
            val options = BitmapFactory.Options().apply { inJustDecodeBounds = true }
            BitmapFactory.decodeByteArray(bytes, 0, bytes.size, options)

            options.inSampleSize = PhotoPickerHelper.calculateInSampleSize(options, reqWidth, reqHeight)
            options.inJustDecodeBounds = false

            val rawBitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.size, options)
            if (rawBitmap != null) {
                PhotoPickerHelper.rotateBitmapIfRequired(rawBitmap, bytes)
            } else {
                null
            }
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
}
`,
  },
  {
    id: 'bill_builder_screen',
    filename: 'BillBuilderScreen.kt',
    path: 'app/src/main/java/com/bolobill/app/ui/screens/BillBuilderScreen.kt',
    badge: 'Jetpack Compose UI',
    description: 'Material 3 Screen with warranty chips, photo picker, trade normalizer, paid toggle, and animateFloatAsState Paid watermark stamp entry animation.',
    code: `package com.bolobill.app.ui.screens

import android.widget.Toast
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
import com.bolobill.app.util.PhotoPickerHelper
import com.bolobill.app.util.TradeDictionary
import com.bolobill.app.util.WorkProofThumbnailSlot

/**
 * BillBuilderScreen: Primary Jetpack Compose screen for quotation creation.
 *
 * KEY FEATURES INTEGRATED:
 * 1. Before & After Work Proof Slots (Interactive Photo Picker)
 * 2. Warranty / Service Guarantee horizontal single-choice chip group
 * 3. Offline TradeDictionary Hinglish / English normalizer switch
 * 4. Voice dictation parser with real-time translation
 * 5. Instant Receipt Mode (Paid toggle) with Live Invoice Preview
 * 6. Subtle 'stamp' entry animation for the Paid watermark using animateFloatAsState
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BillBuilderScreen(
    currentInvoice: Invoice,
    onSaveInvoice: (Invoice) -> Unit,
    onNavigateToPreview: (Invoice) -> Unit
) {
    val context = LocalContext.current

    // Mutable Screen State
    var clientName by remember { mutableStateOf(currentInvoice.clientName) }
    var clientPhone by remember { mutableStateOf(currentInvoice.clientPhone) }
    var clientAddress by remember { mutableStateOf(currentInvoice.clientAddress) }
    var selectedWarranty by remember { mutableStateOf(currentInvoice.warrantyTerm ?: "30_DAYS") }
    var languageMode by remember { mutableStateOf(if (currentInvoice.pdfLanguage == "HINGLISH") TradeDictionary.LanguageMode.HINGLISH else TradeDictionary.LanguageMode.ENGLISH) }
    var isPaid by remember { mutableStateOf(currentInvoice.isPaid) }

    var beforePhotoUri by remember { mutableStateOf(currentInvoice.beforePhotoUri) }
    var afterPhotoUri by remember { mutableStateOf(currentInvoice.afterPhotoUri) }

    val itemsList = remember { mutableStateListOf<InvoiceItem>().apply { addAll(currentInvoice.items) } }

    // Voice dictation quick input dialog state
    var showVoiceDialog by remember { mutableStateOf(false) }

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
                    // Language Switch Button
                    TextButton(onClick = {
                        languageMode = if (languageMode == TradeDictionary.LanguageMode.ENGLISH)
                            TradeDictionary.LanguageMode.HINGLISH else TradeDictionary.LanguageMode.ENGLISH
                        // Normalize existing items dynamically
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
                    OutlinedButton(
                        onClick = { showVoiceDialog = true },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.Mic, contentDescription = "Bolo Voice")
                        Spacer(Modifier.width(6.dp))
                        Text("Bolo Bill")
                    }

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
                        modifier = Modifier.weight(1.5f),
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
            // 1. Client Details Section
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

            // 2. FEATURE 1: Before & After Work Proof Photos (Photo Picker)
            item {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "Work Proof Photos / कार्य प्रमाण (Before & After)",
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

            // 3. FEATURE 2: Service Guarantee / Warranty Badge Horizontal Chip Group
            item {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "Service Guarantee / वारंटी स्टाम्प",
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

            // 4. Line Items Table Header
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Bill Items / कार्य सूची", style = MaterialTheme.typography.titleSmall)
                    TextButton(onClick = {
                        itemsList.add(
                            InvoiceItem(
                                id = "item_\${System.currentTimeMillis()}",
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

            // 5. Dynamic Line Items List
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
                                "₹\${item.rate} x \${item.quantity} \${item.unit} = ₹\${item.amount}",
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

            // 6. 1-Tap "Payment Receipt" Mode (Mark as Paid) Switch
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
                                    text = if (isPaid) "Marked as Paid (रसीद मोड)" else "Payment Pending (बाकी)",
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

            // 7. Invoice Live Preview with animateFloatAsState Paid Watermark Stamp
            item {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Invoice Live Preview / बिल पूर्वावलोकन",
                            style = MaterialTheme.typography.titleSmall
                        )
                        if (isPaid) {
                            Text(
                                text = "Watermark Stamp Active",
                                style = MaterialTheme.typography.labelSmall,
                                color = Color(0xFF16A34A)
                            )
                        }
                    }

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
                            // Invoice Preview Content
                            Column(
                                modifier = Modifier.fillMaxWidth(),
                                verticalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                // Header
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
                                            text = "#\${currentInvoice.invoiceNumber}",
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

                                // Customer summary
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        text = "To: \${clientName.ifEmpty { \"Customer Name\" }}",
                                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Medium)
                                    )
                                    Text(
                                        text = clientPhone.ifEmpty { \"+91 98765 43210\" },
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.outline
                                    )
                                }

                                // Items summary
                                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                    itemsList.take(3).forEach { item ->
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Text(
                                                text = "• \${item.name}",
                                                style = MaterialTheme.typography.bodySmall,
                                                modifier = Modifier.weight(1f)
                                            )
                                            Text(
                                                text = "₹\${item.amount}",
                                                style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold)
                                            )
                                        }
                                    }
                                    if (itemsList.size > 3) {
                                        Text(
                                            text = "+ \${itemsList.size - 3} more items...",
                                            style = MaterialTheme.typography.labelSmall,
                                            color = MaterialTheme.colorScheme.outline
                                        )
                                    }
                                }

                                HorizontalDivider(color = MaterialTheme.colorScheme.surfaceVariant)

                                // Total Row
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
                                        text = "₹\${total}",
                                        style = MaterialTheme.typography.titleMedium.copy(
                                            fontWeight = FontWeight.Bold,
                                            color = MaterialTheme.colorScheme.primary
                                        )
                                    )
                                }
                            }

                            // Subtle 'stamp' entry animation for the Paid watermark in the invoice preview
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

/**
 * PaidWatermarkStamp: Subtle 'stamp' entry animation for the Paid watermark in the invoice preview.
 *
 * Uses animateFloatAsState in Jetpack Compose:
 * - watermarkAlpha: Fades in smoothly from 0f to 0.85f via tween(400, FastOutSlowInEasing).
 * - watermarkScale: Physics spring simulation easing down from 1.30f to 1.0f (simulating an ink stamp impact).
 * - watermarkRotation: Angular spring settling into -18 degrees diagonal tilt.
 */
@Composable
fun PaidWatermarkStamp(
    isPaid: Boolean,
    modifier: Modifier = Modifier
) {
    // 1. Alpha fade-in animation
    val watermarkAlpha by animateFloatAsState(
        targetValue = if (isPaid) 0.85f else 0.0f,
        animationSpec = tween(durationMillis = 400, easing = FastOutSlowInEasing),
        label = "WatermarkAlpha"
    )

    // 2. Scale bounce / stamp impact animation
    val watermarkScale by animateFloatAsState(
        targetValue = if (isPaid) 1.0f else 1.30f,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessLow
        ),
        label = "WatermarkScale"
    )

    // 3. Diagonal rotation tilt settling
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
`,
  },
  {
    id: 'pdf_preview_screen',
    filename: 'PdfPreviewScreen.kt',
    path: 'app/src/main/java/com/bolobill/app/ui/screens/PdfPreviewScreen.kt',
    badge: 'Receipt & WhatsApp Share',
    description: 'Compose Screen with 1-Tap Mark as Paid toggle, dynamic WhatsApp intent generation, and Scoped FileProvider dispatch.',
    code: `package com.bolobill.app.ui.screens

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.core.content.FileProvider
import com.bolobill.app.data.model.Invoice
import com.bolobill.app.pdf.PdfGenerator
import com.bolobill.app.util.ShareableIntentHelper
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File
import java.net.URLEncoder

/**
 * PdfPreviewScreen: Review, toggle Instant Receipt (Mark as Paid), and Share via WhatsApp.
 *
 * CRITICAL FEATURES:
 * 1. 1-Tap "Mark as Paid" receipt toggle:
 *    - Updates invoice state and generates clearance stamp.
 *    - Triggers canvas diagonal semi-transparent watermark.
 * 2. Dynamic WhatsApp message generation:
 *    - If Unpaid: "नमस्ते [Name], आपका बिल ₹[Amount] तैयार है। कृपया UPI QR कोड स्कैन करके भुगतान करें। धन्यवाद!"
 *    - If Paid: "नमस्ते [Name], आपका भुगतान ₹[Amount] सफलतापूर्वक प्राप्त हो गया है। रसीद संलग्न है।"
 * 3. Zero broad permissions:
 *    - Shares PDF via Android FileProvider (FLAG_GRANT_READ_URI_PERMISSION).
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PdfPreviewScreen(
    invoice: Invoice,
    onInvoiceUpdated: (Invoice) -> Unit,
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var isPaidState by remember { mutableStateOf(invoice.isPaid) }
    var generatedPdfFile by remember { mutableStateOf<File?>(null) }
    var isRenderingPdf by remember { mutableStateOf(true) }

    // Re-generate PDF when payment status is toggled
    LaunchedEffect(isPaidState) {
        isRenderingPdf = true
        coroutineScope.launch {
            val updatedInvoice = invoice.copy(
                isPaid = isPaidState,
                paidDate = if (isPaidState) (invoice.paidDate ?: System.currentTimeMillis()) else null
            )
            val pdfFile = PdfGenerator.generateInvoicePdf(context, updatedInvoice)
            withContext(Dispatchers.Main) {
                generatedPdfFile = pdfFile
                isRenderingPdf = false
                onInvoiceUpdated(updatedInvoice)
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (isPaidState) "Payment Receipt (रसीद)" else "Invoice Preview") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        },
        bottomBar = {
            Surface(tonalElevation = 8.dp, modifier = Modifier.fillMaxWidth()) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    // WhatsApp Share Intent Button
                    Button(
                        onClick = {
                            if (generatedPdfFile != null) {
                                dispatchWhatsAppIntent(context, invoice, isPaidState, generatedPdfFile!!)
                            } else {
                                Toast.makeText(context, "Rendering PDF, please wait...", Toast.LENGTH_SHORT).show()
                            }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF25D366)) // WhatsApp Official Green
                    ) {
                        Icon(Icons.Default.Share, contentDescription = "Share", tint = Color.White)
                        Spacer(Modifier.width(8.dp))
                        Text(
                            text = if (isPaidState) "WhatsApp Payment Receipt" else "WhatsApp Invoice & UPI",
                            color = Color.White,
                            style = MaterialTheme.typography.titleSmall
                        )
                    }
                }
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // 1. Instant "Payment Receipt" Mode (Mark as Paid) Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(
                    containerColor = if (isPaidState) Color(0xFFF0FDF4) else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                )
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        Icon(
                            imageVector = if (isPaidState) Icons.Default.CheckCircle else Icons.Default.Pending,
                            contentDescription = null,
                            tint = if (isPaidState) Color(0xFF16A34A) else MaterialTheme.colorScheme.outline
                        )
                        Column {
                            Text(
                                text = if (isPaidState) "Marked as Paid (भुगतान प्राप्त)" else "Payment Pending (बाकी)",
                                style = MaterialTheme.typography.titleMedium,
                                color = if (isPaidState) Color(0xFF166534) else MaterialTheme.colorScheme.onSurface
                            )
                            Text(
                                text = if (isPaidState) "Switches to green watermark & removes UPI QR" else "Shows UPI QR code for scanning",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.outline
                            )
                        }
                    }

                    // 1-Tap Toggle Switch
                    Switch(
                        checked = isPaidState,
                        onCheckedChange = { isPaidState = it },
                        thumbContent = if (isPaidState) {
                            { Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(14.dp)) }
                        } else null
                    )
                }
            }

            // 2. WhatsApp Live Intent Preview Box
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFE7FCE8))
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Chat, contentDescription = null, tint = Color(0xFF128C7E), modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(6.dp))
                        Text("WhatsApp Message Preview:", style = MaterialTheme.typography.labelMedium, color = Color(0xFF128C7E))
                    }
                    val msg = getWhatsAppMessage(invoice.clientName, invoice.totalAmount, isPaidState)
                    Text(text = msg, style = MaterialTheme.typography.bodyMedium, color = Color(0xFF1F2937))
                }
            }

            // 3. PDF Rendering Status & Inspection
            if (isRenderingPdf) {
                Box(modifier = Modifier.fillMaxWidth().weight(1f), contentAlignment = Alignment.Center) {
                    Column(horizontalAlignment = Alignment.CenterAlignment) {
                        CircularProgressIndicator()
                        Spacer(Modifier.height(12.dp))
                        Text("Generating compliant A4 Canvas PDF...")
                    }
                }
            } else {
                Card(
                    modifier = Modifier.fillMaxWidth().weight(1f),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Column(
                        modifier = Modifier.fillMaxSize().padding(16.dp),
                        verticalArrangement = Arrangement.Center,
                        horizontalAlignment = Alignment.CenterAlignment
                    ) {
                        Icon(Icons.Default.CheckCircleOutline, contentDescription = null, tint = Color(0xFF16A34A), modifier = Modifier.size(48.dp))
                        Spacer(Modifier.height(8.dp))
                        Text("A4 PDF Rendered Successfully", style = MaterialTheme.typography.titleMedium)
                        Text(
                            text = "Saved in Scoped Storage: \${generatedPdfFile?.name}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.outline
                        )
                        Spacer(Modifier.height(14.dp))
                        Button(onClick = {
                            openPdfExternalViewer(context, generatedPdfFile)
                        }) {
                            Icon(Icons.Default.Visibility, contentDescription = "View")
                            Spacer(Modifier.width(6.dp))
                            Text("Open in PDF Viewer")
                        }
                    }
                }
            }
        }
    }
}

/**
 * Returns dynamic WhatsApp greeting message depending on payment state.
 */
fun getWhatsAppMessage(clientName: String, amount: Double, isPaid: Boolean): String {
    val formattedAmount = String.format(java.util.Locale.ROOT, "%.0f", amount)
    return if (isPaid) {
        "नमस्ते $clientName जी, आपके काम का कुल भुगतान ₹$formattedAmount प्राप्त हो गया है। रसीद संलग्न है। धन्यवाद!"
    } else {
        "नमस्ते $clientName जी, आपके काम का बिल ₹$formattedAmount है। कृपया संलग्न PDF में दिए गए UPI QR कोड से भुगतान करें। धन्यवाद!"
    }
}

fun dispatchWhatsAppIntent(context: Context, invoice: Invoice, isPaid: Boolean, pdfFile: File) {
    ShareableIntentHelper.shareInvoiceViaWhatsApp(context, invoice, isPaid, pdfFile)
}

fun openPdfExternalViewer(context: Context, pdfFile: File?) {
    if (pdfFile == null) return
    ShareableIntentHelper.openPdfInExternalViewer(context, pdfFile)
}
`,
  },
  {
    id: 'shareable_intent_helper',
    filename: 'ShareableIntentHelper.kt',
    path: 'app/src/main/java/com/bolobill/app/util/ShareableIntentHelper.kt',
    badge: '1-Tap WhatsApp Share',
    description: 'Constructs polite Hindi WhatsApp messages, attaches scoped FileProvider URIs, and executes direct WhatsApp dispatch with Android Share Sheet fallback.',
    code: `package com.bolobill.app.util

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.widget.Toast
import androidx.core.content.FileProvider
import com.bolobill.app.data.model.Invoice
import java.io.File
import java.util.Locale

/**
 * ShareableIntentHelper:
 * Constructs dynamic, localized WhatsApp billing messages and dispatches
 * scoped FileProvider URIs for seamless one-tap invoice sharing without
 * requiring storage permissions (compliant with Android 15 & Google Play policies).
 */
object ShareableIntentHelper {

    private const val FILE_PROVIDER_AUTHORITY_SUFFIX = ".fileprovider"
    const val PACKAGE_WHATSAPP = "com.whatsapp"
    const val PACKAGE_WHATSAPP_BUSINESS = "com.whatsapp.w4b"

    /**
     * Constructs a pre-formatted, polite Hindi greeting and payment status message.
     */
    fun buildWhatsAppMessage(clientName: String, amount: Double, isPaid: Boolean): String {
        val formattedAmount = String.format(Locale.ROOT, "%.0f", amount)
        return if (isPaid) {
            "नमस्ते $clientName जी, आपके काम का कुल भुगतान ₹$formattedAmount प्राप्त हो गया है। रसीद संलग्न है। धन्यवाद!"
        } else {
            "नमस्ते $clientName जी, आपके काम का बिल ₹$formattedAmount है। कृपया संलग्न PDF में दिए गए UPI QR कोड से भुगतान करें। धन्यवाद!"
        }
    }

    /**
     * Generates a secure content URI using AndroidX FileProvider.
     * Grants temporary read permission to targeted receiving applications (WhatsApp/Drive).
     */
    fun getFileProviderUri(context: Context, pdfFile: File): Uri {
        require(pdfFile.exists()) { "Invoice PDF file does not exist: \${pdfFile.absolutePath}" }
        val authority = "\${context.packageName}$FILE_PROVIDER_AUTHORITY_SUFFIX"
        return FileProvider.getUriForFile(context, authority, pdfFile)
    }

    /**
     * Resolves whether standard WhatsApp or WhatsApp Business is installed.
     */
    fun getInstalledWhatsAppPackage(context: Context): String? {
        val pm = context.packageManager
        return try {
            pm.getPackageInfo(PACKAGE_WHATSAPP, PackageManager.GET_ACTIVITIES)
            PACKAGE_WHATSAPP
        } catch (_: PackageManager.NameNotFoundException) {
            try {
                pm.getPackageInfo(PACKAGE_WHATSAPP_BUSINESS, PackageManager.GET_ACTIVITIES)
                PACKAGE_WHATSAPP_BUSINESS
            } catch (_: PackageManager.NameNotFoundException) {
                null
            }
        }
    }

    /**
     * Dispatches the invoice PDF and pre-formatted text directly to WhatsApp with 1-tap.
     * Gracefully falls back to Android System Share Sheet if WhatsApp is not installed.
     */
    fun shareInvoiceViaWhatsApp(
        context: Context,
        invoice: Invoice,
        isPaid: Boolean,
        pdfFile: File
    ) {
        val messageText = buildWhatsAppMessage(invoice.clientName, invoice.totalAmount, isPaid)
        val contentUri = getFileProviderUri(context, pdfFile)
        val targetPackage = getInstalledWhatsAppPackage(context)

        val sendIntent = Intent(Intent.ACTION_SEND).apply {
            type = "application/pdf"
            putExtra(Intent.EXTRA_STREAM, contentUri)
            putExtra(Intent.EXTRA_TEXT, messageText)
            putExtra(Intent.EXTRA_SUBJECT, "Invoice #\${invoice.invoiceNumber} - \${invoice.technicianName}")
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            if (targetPackage != null) {
                setPackage(targetPackage)
            }
        }

        try {
            context.startActivity(sendIntent)
        } catch (e: Exception) {
            // Fallback to standard system share chooser
            val chooserIntent = Intent(Intent.ACTION_SEND).apply {
                type = "application/pdf"
                putExtra(Intent.EXTRA_STREAM, contentUri)
                putExtra(Intent.EXTRA_TEXT, messageText)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            context.startActivity(Intent.createChooser(chooserIntent, "Share Invoice via..."))
        }
    }

    /**
     * Opens the generated PDF in an installed external PDF viewer (e.g., Google Drive, Adobe).
     */
    fun openPdfInExternalViewer(context: Context, pdfFile: File) {
        try {
            val contentUri = getFileProviderUri(context, pdfFile)
            val viewIntent = Intent(Intent.ACTION_VIEW).apply {
                setDataAndType(contentUri, "application/pdf")
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            context.startActivity(viewIntent)
        } catch (e: Exception) {
            Toast.makeText(context, "No PDF viewer application found on device", Toast.LENGTH_SHORT).show()
        }
    }

    /**
     * Copies the pre-formatted WhatsApp text message to clipboard with feedback.
     */
    fun copyMessageToClipboard(context: Context, message: String) {
        val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        val clip = ClipData.newPlainText("BoloBill WhatsApp Message", message)
        clipboard.setPrimaryClip(clip)
        Toast.makeText(context, "Message copied to clipboard", Toast.LENGTH_SHORT).show()
    }
}
`,
  },
  {
    id: 'invoice_entity',
    filename: 'Invoice.kt',
    path: 'app/src/main/java/com/bolobill/app/data/model/Invoice.kt',
    badge: 'Room Database Entity',
    description: 'Updated Room Entity with beforePhotoUri, afterPhotoUri, warrantyTerm, pdfLanguage, and paidDate fields.',
    code: `package com.bolobill.app.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.TypeConverter
import androidx.room.TypeConverters
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

/**
 * Invoice: Room Database Entity for BoloBill offline-first persistence.
 *
 * EXTENDED ATTRIBUTES (PER SPECIFICATION):
 * - beforePhotoUri: Local Uri to "Before Work" proof thumbnail.
 * - afterPhotoUri: Local Uri to "After Work" proof thumbnail.
 * - warrantyTerm: "NO_WARRANTY", "15_DAYS", "30_DAYS", "90_DAYS".
 * - pdfLanguage: "HINGLISH" or "ENGLISH".
 * - paidDate: Epoch timestamp when payment was cleared.
 */
@Entity(tableName = "invoices")
@TypeConverters(InvoiceItemConverter::class)
data class Invoice(
    @PrimaryKey
    val id: String,
    val invoiceNumber: String,
    val clientName: String,
    val clientPhone: String,
    val clientAddress: String,
    val technicianName: String,
    val technicianTrade: String,
    val technicianUpiId: String,
    val items: List<InvoiceItem>,
    val subtotal: Double,
    val discount: Double = 0.0,
    val totalAmount: Double,
    val createdAt: Long = System.currentTimeMillis(),

    // Payment state & clearance date
    val isPaid: Boolean = false,
    val paidDate: Long? = null,
    val paymentMode: String? = "UPI",

    // New Google Play-compliant fields
    val beforePhotoUri: String? = null,
    val afterPhotoUri: String? = null,
    val warrantyTerm: String? = "30_DAYS",
    val pdfLanguage: String = "ENGLISH",
    val notes: String? = null
)

data class InvoiceItem(
    val id: String,
    val name: String,
    val quantity: Int = 1,
    val unit: String = "nos",
    val rate: Double = 0.0,
    val amount: Double = 0.0
)

class InvoiceItemConverter {
    private val gson = Gson()

    @TypeConverter
    fun fromItemList(items: List<InvoiceItem>?): String {
        return gson.toJson(items ?: emptyList<InvoiceItem>())
    }

    @TypeConverter
    fun toItemList(json: String?): List<InvoiceItem> {
        if (json.isNullOrEmpty()) return emptyList()
        val type = object : TypeToken<List<InvoiceItem>>() {}.type
        return gson.fromJson(json, type)
    }
}
`,
  },
  {
    id: 'android_manifest',
    filename: 'AndroidManifest.xml',
    path: 'app/src/main/AndroidManifest.xml',
    badge: 'Play Console Compliant',
    description: 'Zero broad permissions (No SMS, No MANAGE_EXTERNAL_STORAGE). FileProvider for scoped sharing and target SDK 35.',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- GOOGLE PLAY COMPLIANCE AUDIT CONFIRMATION:
         1. ZERO BROAD PERMISSIONS:
            - NO android.permission.READ_SMS
            - NO android.permission.RECEIVE_SMS
            - NO android.permission.MANAGE_EXTERNAL_STORAGE
            - NO android.permission.READ_EXTERNAL_STORAGE
            - NO android.permission.READ_MEDIA_IMAGES (Native Photo Picker used instead!)
         2. TARGET SDK: 35+ (Android 15 ready)
         3. STORAGE: Scoped Storage with FileProvider.
    -->

    <!-- Voice dictation permission (User-triggered only) -->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />

    <!-- Queries element for targeting WhatsApp & UPI dispatch without QUERY_ALL_PACKAGES -->
    <queries>
        <package android:name="com.whatsapp" />
        <package android:name="com.whatsapp.w4b" />
        <intent>
            <action android:name="android.intent.action.VIEW" />
            <data android:scheme="upi" />
        </intent>
        <intent>
            <action android:name="android.intent.action.SEND" />
            <data android:mimeType="application/pdf" />
        </intent>
    </queries>

    <application
        android:name=".BoloBillApp"
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="BoloBill"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.BoloBill">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.BoloBill"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Android FileProvider for secure PDF sharing to WhatsApp without external storage permission -->
        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="\${applicationId}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>

    </application>

</manifest>
`,
  },
  {
    id: 'file_paths',
    filename: 'file_paths.xml',
    path: 'app/src/main/res/xml/file_paths.xml',
    badge: 'Scoped Storage',
    description: 'FileProvider path configurations for scoped caching of generated invoices and work proof images.',
    code: `<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Scoped cache directory for generated A4 PDFs shared to WhatsApp -->
    <cache-path name="invoice_cache" path="invoices/" />

    <!-- Scoped cache directory for compressed work proof thumbnails -->
    <cache-path name="work_proofs_cache" path="work_proofs/" />

    <!-- App-specific external documents directory -->
    <external-files-path name="invoice_documents" path="Documents/Invoices/" />
</paths>
`,
  },
  {
    id: 'build_gradle',
    filename: 'build.gradle.kts',
    path: 'app/build.gradle.kts',
    badge: 'Gradle Build',
    description: 'Android Gradle build configuration with ZXing QR engine, EXIF orientation corrector, Jetpack Compose BOM, and R8 optimization.',
    code: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}

android {
    namespace = "com.bolobill.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.bolobill.app"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
        freeCompilerArgs += listOf(
            "-opt-in=androidx.compose.material3.ExperimentalMaterial3Api"
        )
    }

    buildFeatures {
        compose = true
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    // AndroidX Core & Lifecycle
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
    implementation("androidx.activity:activity-compose:1.10.1")

    // Jetpack Compose BOM
    val composeBom = platform("androidx.compose:compose-bom:2024.12.01")
    implementation(composeBom)
    androidTestImplementation(composeBom)

    // Jetpack Compose UI & Material 3
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")

    // Room Local Database Persistence
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")

    // QR Code Engine (Offline Canvas Bitmap Generator for Dynamic UPI QR)
    implementation("com.google.zxing:core:3.5.3")

    // EXIF Image Orientation Normalizer (Before / After Work Proof Photos)
    implementation("androidx.exifinterface:exifinterface:1.3.7")

    // JSON Serialization & Data Persistence
    implementation("com.google.code.gson:gson:2.11.0")

    // Coroutines for background PDF rendering & Photo compression
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")

    // Unit Testing
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.2.1")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.6.1")
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
}
`,
  },
];
