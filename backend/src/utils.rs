use std::time::{SystemTime, UNIX_EPOCH};

pub fn get_time() -> u64 {
    match SystemTime::now().duration_since(UNIX_EPOCH) {
        Ok(n) => n.as_secs(),
        Err(_) => panic!("SystemTime before UNIX Epoch"),
    }
}
