# Soroban Inter-Contract Call Flow

This document outlines the interaction between **Contract A (Token)** and **Contract B (Pool)**.

## 🏗️ Contracts Overview

| Contract | Responsibility | Key Storage |
| :--- | :--- | :--- |
| **Contract A (Token)** | Supply tracking & Ledger management | `Persistent: Balance`, `Instance: Total Supply` |
| **Contract B (Pool)** | Swap orchestration & Error handling | `Instance: Token Address` |

## 🔄 Call Flow: `pool.swap(user, amount)`

1.  **User Authentication**: `Pool` calls `from.require_auth()` to ensure the user authorized the swap.
2.  **State Lookup**: `Pool` retrieves the `TokenAddress` from its instance storage.
3.  **Cross-Contract Invocation**:
    - `Pool` initializes a `TokenClient`.
    - `Pool` calls `client.try_transfer(user, pool, amount)`.
4.  **Token Logic (Contract A)**:
    - Verifies user balance.
    - Updates user and pool balances in persistent storage.
    - Updates `Total Supply` if applicable.
    - Emits `transfer` event.
    - Returns `Result<(), TokenError>`.
5.  **Error Propagation (Contract B)**:
    - If `Token` returns `Ok`, `Pool` emits `swap_ok` and returns `Ok`.
    - If `Token` returns `Err(InsufficientBalance)`, `Pool` catches this and returns `Err(TokenCallFailed)`.
    - This pattern prevents the pool state from becoming inconsistent while providing clear error feedback.

## 📡 Event Log

| Source | Event Name | Data |
| :--- | :--- | :--- |
| **Token** | `transfer` | `(from: Address, to: Address, amount: i128)` |
| **Pool** | `swap_ok` | `(user: Address, amount: i128)` |

## 🛠️ Error Codes

- **TokenError**: `1: InsufficientBalance`, `2: InvalidAmount`, `3: Unauthorized`.
- **PoolError**: `101: TokenCallFailed`, `102: InsufficientLiquidity`, `103: NotInitialized`.
