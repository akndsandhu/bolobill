package com.bolobill.app.ui.components

import android.content.Context
import android.graphics.Bitmap
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Done
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.dp
import java.io.File
import java.io.FileOutputStream

@Composable
fun DigitalSignatureDialog(
    context: Context,
    onDismiss: () -> Unit,
    onSignatureSaved: (savedPath: String) -> Unit
) {
    val paths = remember { mutableStateListOf<List<Offset>>() }
    var currentPath by remember { mutableStateOf<List<Offset>>(emptyList()) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("ग्राहक के डिजिटल हस्ताक्षर (Sign Here)") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("नीचे दिए गए बॉक्स में उंगली से हस्ताक्षर करें:", style = MaterialTheme.typography.bodySmall)

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(180.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(Color(0xFFF8FAFC))
                        .border(1.5.dp, Color(0xFF94A3B8), RoundedCornerShape(8.dp))
                        .pointerInput(Unit) {
                            detectDragGestures(
                                onDragStart = { offset ->
                                    currentPath = listOf(offset)
                                },
                                onDrag = { change, _ ->
                                    currentPath = currentPath + change.position
                                },
                                onDragEnd = {
                                    if (currentPath.isNotEmpty()) {
                                        paths.add(currentPath)
                                        currentPath = emptyList()
                                    }
                                }
                            )
                        }
                ) {
                    Canvas(modifier = Modifier.fillMaxSize()) {
                        paths.forEach { pathPoints ->
                            if (pathPoints.size > 1) {
                                val drawPath = Path().apply {
                                    moveTo(pathPoints.first().x, pathPoints.first().y)
                                    for (i in 1 until pathPoints.size) {
                                        lineTo(pathPoints[i].x, pathPoints[i].y)
                                    }
                                }
                                drawPath(
                                    path = drawPath,
                                    color = Color.Black,
                                    style = Stroke(width = 4.5f, cap = StrokeCap.Round, join = StrokeJoin.Round)
                                )
                            }
                        }

                        if (currentPath.size > 1) {
                            val livePath = Path().apply {
                                moveTo(currentPath.first().x, currentPath.first().y)
                                for (i in 1 until currentPath.size) {
                                    lineTo(currentPath[i].x, currentPath[i].y)
                                }
                            }
                            drawPath(
                                path = livePath,
                                color = Color.Black,
                                style = Stroke(width = 4.5f, cap = StrokeCap.Round, join = StrokeJoin.Round)
                            )
                        }
                    }

                    if (paths.isEmpty() && currentPath.isEmpty()) {
                        Text(
                            "यहाँ साइन करें ✍️",
                            color = Color(0xFF94A3B8),
                            modifier = Modifier.align(Alignment.Center)
                        )
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (paths.isNotEmpty()) {
                        val signatureFile = saveSignatureBitmap(context, paths)
                        if (signatureFile != null) {
                            onSignatureSaved(signatureFile.absolutePath)
                        }
                    }
                    onDismiss()
                }
            ) {
                Icon(Icons.Default.Done, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(Modifier.width(4.dp))
                Text("सुरक्षित करें")
            }
        },
        dismissButton = {
            TextButton(onClick = { paths.clear() }) {
                Icon(Icons.Default.Clear, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(Modifier.width(4.dp))
                Text("मिटाएं (Clear)")
            }
        }
    )
}

private fun saveSignatureBitmap(context: Context, paths: List<List<Offset>>): File? {
    return try {
        val width = 500
        val height = 200
        val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        val canvas = android.graphics.Canvas(bitmap)
        canvas.drawColor(android.graphics.Color.WHITE)

        val paint = android.graphics.Paint().apply {
            color = android.graphics.Color.BLACK
            strokeWidth = 5f
            isAntiAlias = true
            style = android.graphics.Paint.Style.STROKE
            strokeCap = android.graphics.Paint.Cap.ROUND
            strokeJoin = android.graphics.Paint.Join.ROUND
        }

        paths.forEach { points ->
            if (points.size > 1) {
                val path = android.graphics.Path().apply {
                    moveTo(points[0].x, points[0].y)
                    for (i in 1 until points.size) {
                        lineTo(points[i].x, points[i].y)
                    }
                }
                canvas.drawPath(path, paint)
            }
        }

        val dir = File(context.cacheDir, "signatures").apply { if (!exists()) mkdirs() }
        val file = File(dir, "sign_${System.currentTimeMillis()}.png")
        FileOutputStream(file).use { out ->
            bitmap.compress(Bitmap.CompressFormat.PNG, 90, out)
        }
        file
    } catch (e: Exception) {
        null
    }
}
