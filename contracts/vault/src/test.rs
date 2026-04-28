#![cfg(test)]
extern crate std;

use super::*;
use soroban_sdk::{testutils::Address as _, Env};

#[test]
fn test_init() {
    let env = Env::default();
    env.mock_all_auths();

    let vault_id = env.register_contract(None, PoolContract);
    let vault_client = PoolContractClient::new(&env, &vault_id);

    let token_address = Address::generate(&env);
    
    vault_client.init(&token_address);
    // As it stands, there is no getter for the token_address, 
    // but the initialization itself shouldn't panic.
}
