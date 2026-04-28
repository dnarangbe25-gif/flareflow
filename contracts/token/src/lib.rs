#![no_std]
use soroban_sdk::{contract, contracterror, contractimpl, symbol_short, Address, Env};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum TokenError {
    InsufficientBalance = 1,
    InvalidAmount = 2,
    Unauthorized = 3,
}

#[contract]
pub struct TokenContract;

#[contractimpl]
impl TokenContract {
    /// Mint new tokens and update total supply.
    pub fn mint(env: Env, to: Address, amount: i128) -> Result<(), TokenError> {
        if amount <= 0 { return Err(TokenError::InvalidAmount); }
        
        let balance = Self::balance_of(env.clone(), to.clone());
        let supply = Self::total_supply(env.clone());

        env.storage().persistent().set(&to, &(balance + amount));
        env.storage().instance().set(&symbol_short!("supply"), &(supply + amount));

        env.events().publish((symbol_short!("mint"), to), amount);
        Ok(())
    }

    /// Transfer tokens with explicit result for error propagation.
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) -> Result<(), TokenError> {
        from.require_auth();

        if amount <= 0 { return Err(TokenError::InvalidAmount); }

        let from_balance = Self::balance_of(env.clone(), from.clone());
        if from_balance < amount {
            return Err(TokenError::InsufficientBalance);
        }

        let to_balance = Self::balance_of(env.clone(), to.clone());

        env.storage().persistent().set(&from, &(from_balance - amount));
        env.storage().persistent().set(&to, &(to_balance + amount));

        env.events().publish((symbol_short!("transfer"), from, to), amount);
        Ok(())
    }

    pub fn balance_of(env: Env, owner: Address) -> i128 {
        env.storage().persistent().get(&owner).unwrap_or(0)
    }

    pub fn total_supply(env: Env) -> i128 {
        env.storage().instance().get(&symbol_short!("supply")).unwrap_or(0)
    }
}

#[cfg(test)]
mod test;
