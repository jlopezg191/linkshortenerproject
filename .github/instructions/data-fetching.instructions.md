---
description: Read this file to understand how to fecth data in the project.
---
# Data Fetching Guidelines
This document provides guidelines for fetching data in the project. It covers best practices, recommended libraries, and common patterns to ensure consistency and maintainability across the codebase.

## 1. Use Server Components for Data Fetching

In Text.js, ALWAYS use server components for data fetching. NEVER use client components for data fetching.

## 2. Data Fetching Methods

ALWAYS use the helper functions in /data directory for data fetching. NEVER use fetch directly in your components.

ALL helper functions in /data directory should use Drizzle ORM for database queries.