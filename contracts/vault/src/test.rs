#![cfg(test)]
use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

mod token_contract {
    soroban_sdk::contractimport!(
        file = "../../target/wasm32-unknown-unknown/release/token.wasm"
    );
}

#[test]
fn test_swap_math_precision() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let user = Address::generate(&env);

    let token_a_id = env.register_contract_wasm(None, token_contract::WASM);
    let token_b_id = env.register_contract_wasm(None, token_contract::WASM);
    
    let client_a = token::Client::new(&env, &token_a_id);
    let client_b = token::Client::new(&env, &token_b_id);

    client_a.init(&admin);
    client_b.init(&admin);

    let pool_id = env.register_contract(None, LiquidityPool);
    let pool_client = LiquidityPoolClient::new(&env, &pool_id);
    pool_client.init(&token_a_id, &token_b_id);

    // Initial reserves: 1,000,000 : 1,000,000
    client_a.mint(&admin, &1000000);
    client_b.mint(&admin, &1000000);
    pool_client.deposit(&admin, &1000000, &1000000);

    // Swap 100,000 Token A
    // (1,000,000 * 100,000) / (1,000,000 + 100,000) = 100,000,000,000 / 1,100,000 = 90,909.09 -> 90,909
    client_a.mint(&user, &100000);
    let amount_out = pool_client.swap(&user, &token_a_id, &100000);
    
    assert_eq!(amount_out, 90909);
}

#[test]
#[should_panic(expected = "ZeroAmount")]
fn test_zero_amount_deposit() {
    let env = Env::default();
    let admin = Address::generate(&env);
    let pool_id = env.register_contract(None, LiquidityPool);
    let pool_client = LiquidityPoolClient::new(&env, &pool_id);
    
    env.mock_all_auths();
    pool_client.deposit(&admin, &0, &100);
}
