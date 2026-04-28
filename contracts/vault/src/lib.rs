#![no_std]
use soroban_sdk::{contract, contracterror, contractimpl, symbol_short, Address, Env, log};

mod token {
    soroban_sdk::contractimport!(file = "../../target/wasm32v1-none/release/token.wasm");
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum PoolError {
    TokenCallFailed = 101,
    InsufficientLiquidity = 102,
    NotInitialized = 103,
}

#[contract]
pub struct PoolContract;

#[contractimpl]
impl PoolContract {
    pub fn init(env: Env, token_address: Address) {
        env.storage().instance().set(&symbol_short!("token"), &token_address);
    }

    /// Swap function that invokes TokenContract's transfer function.
    /// Demonstrates error propagation from Contract A to Contract B.
    pub fn swap(env: Env, from: Address, amount: i128) -> Result<(), PoolError> {
        from.require_auth();

        let token_addr: Address = env.storage().instance().get(&symbol_short!("token"))
            .ok_or(PoolError::NotInitialized)?;
        
        let client = token::Client::new(&env, &token_addr);

        // Perform the transfer from user to pool
        // Using try_transfer to catch and propagate errors from the Token contract
        let result = client.try_transfer(&from, &env.current_contract_address(), &amount);

        match result {
            Ok(Ok(_)) => {
                // Transfer successful, emit pool event
                env.events().publish((symbol_short!("swap_ok"), from), amount);
                Ok(())
            },
            Ok(Err(_token_err)) => {
                // Token contract returned a logical error (e.g., InsufficientBalance)
                // log!(&env, "Token transfer failed with code: {:?}", _token_err);
                Err(PoolError::TokenCallFailed)
            },
            Err(_) => {
                // Sub-call panicked or failed at the host level
                Err(PoolError::TokenCallFailed)
            }
        }
    }

    pub fn get_pool_balance(env: Env) -> Result<i128, PoolError> {
        let token_addr: Address = env.storage().instance().get(&symbol_short!("token"))
            .ok_or(PoolError::NotInitialized)?;
        let client = token::Client::new(&env, &token_addr);
        Ok(client.balance_of(&env.current_contract_address()))
    }
}

#[cfg(test)]
mod test;
