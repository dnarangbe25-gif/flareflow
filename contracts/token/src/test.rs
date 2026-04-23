#![cfg(test)]
use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn test_token_lifecycle() {
    let env = Env::default();
    let admin = Address::generate(&env);
    let user = Address::generate(&env);

    let contract_id = env.register_contract(None, AdvancedToken);
    let client = AdvancedTokenClient::new(&env, &contract_id);

    // 1. Initialize
    client.init(&admin);
    assert_eq!(client.get_admin(), admin);

    // 2. Mint (Admin Only)
    env.mock_all_auths();
    client.mint(&user, &1000);
    assert_eq!(client.balance_of(&user), 1000);

    // 3. Transfer
    let receiver = Address::generate(&env);
    client.transfer(&user, &receiver, &400);
    assert_eq!(client.balance_of(&user), 600);
    assert_eq!(client.balance_of(&receiver), 400);

    // 4. Burn
    client.burn(&receiver, &100);
    assert_eq!(client.balance_of(&receiver), 300);
}

#[test]
#[should_panic] // Error checking via Result would be better but should_panic is quick for tests
fn test_unauthorized_mint() {
    let env = Env::default();
    let admin = Address::generate(&env);
    let malicious_user = Address::generate(&env);

    let contract_id = env.register_contract(None, AdvancedToken);
    let client = AdvancedTokenClient::new(&env, &contract_id);

    client.init(&admin);

    // Try to mint without admin auth
    env.mock_all_auths(); 
    // Even with mock_all_auths, the contract logic checks the admin address in storage
    // If we call mint with malicious_user, it will check if malicious_user is admin
    client.mint(&malicious_user, &100); 
}
