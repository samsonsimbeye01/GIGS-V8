package com.linka.gig.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.linka.gig.ui.screens.auth.LoginScreen
import com.linka.gig.ui.screens.home.HomeScreen
import com.linka.gig.ui.screens.gigs.GigsScreen
import com.linka.gig.ui.screens.profile.ProfileScreen
import com.linka.gig.ui.screens.chat.ChatScreen

@Composable
fun AppNavigation(navController: NavHostController) {
    NavHost(
        navController = navController,
        startDestination = "login"
    ) {
        composable("login") {
            LoginScreen(
                onNavigateToHome = {
                    navController.navigate("home") {
                        popUpTo("login") { inclusive = true }
                    }
                }
            )
        }
        
        composable("home") {
            HomeScreen(
                onNavigateToGigs = { navController.navigate("gigs") },
                onNavigateToProfile = { navController.navigate("profile") },
                onNavigateToChat = { navController.navigate("chat") }
            )
        }
        
        composable("gigs") {
            GigsScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }
        
        composable("profile") {
            ProfileScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }
        
        composable("chat") {
            ChatScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }
    }
}