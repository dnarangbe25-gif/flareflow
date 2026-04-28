#![cfg(test)]
extern crate std;

use super::*;
use soroban_sdk::{testutils::Address as _, Env};

#[test]
fn test_mint() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, TokenContract);
    let client = TokenContractClient::new(&env, &contract_id);

    let user = Address::generate(&env);
    
    client.mint(&user, &1000);

    assert_eq!(client.balance_of(&user), 1000);
    assert_eq!(client.total_supply(), 1000);
}

#[test]
fn test_transfer() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, TokenContract);
    let client = TokenContractClient::new(&env, &contract_id);

    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);

    client.mint(&user1, &1000);
    client.transfer(&user1, &user2, &400);

    assert_eq!(client.balance_of(&user1), 600);
    assert_eq!(client.balance_of(&user2), 400);
    assert_eq!(client.total_supply(), 1000);
}
