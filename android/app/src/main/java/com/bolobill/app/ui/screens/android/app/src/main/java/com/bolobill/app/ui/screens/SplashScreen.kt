package com.bolobill.app.ui.screens

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.ReceiptLong
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(
    isRegistered: Boolean,
    onNavigateNext: (targetScreen: String) -> Unit
) {
    val scale = remember { Animatable(0.7f) }
    val alpha = remember { Animatable(0f) }

    LaunchedEffect(Unit) {
        alpha.animateTo(1f, animationSpec = tween(700))
        scale.animateTo(1f, animationSpec = tween(800, easing = FastOutSlowInEasing))
        delay(1200)
        onNavigateNext(if (isRegistered) "BUILDER" else "ONBOARDING")
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(Color(0xFF1E3A8A), Color(0xFF0F172A))
                )
            ),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp),
            modifier = Modifier
                .scale(scale.value)
                .alpha(alpha.value)
        ) {
            Box(
                modifier = Modifier
                    .size(100.dp)
                    .background(Color(0xFF2563EB), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.ReceiptLong,
                    contentDescription = "BoloBill",
                    tint = Color.White,
                    modifier = Modifier.size(52.dp)
                )
                Box(
                    modifier = Modifier
                        .size(34.dp)
                        .align(Alignment.BottomEnd)
                        .background(Color(0xFF10B981), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Mic,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }

            Text(
                text = "BoloBill",
                fontSize = 34.sp,
                fontWeight = FontWeight.ExtraBold,
                color = Color.White,
                letterSpacing = 1.sp
            )

            Text(
                text = "बोलकर बनाओ पक्का बिल • आसान UPI भुगतान",
                style = MaterialTheme.typography.bodyMedium,
                color = Color(0xFF93C5FD)
            )
        }

        Text(
            text = "Made for Indian Local Business 🇮🇳",
            style = MaterialTheme.typography.labelSmall,
            color = Color(0xFF64748B),
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 32.dp)
        )
    }
}
