const redis = require('redis');
const { promisify } = require('util');

// Create Redis client
const client = redis.createClient();

// Promisify Redis functions
const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);

// Function to generate random OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to store OTP in Redis
async function storeOTP(userId, otp) {
    
    try {
        await setAsync(userId, otp);
        console.log("asd");
        console.log(`OTP ${otp} stored for user ${userId}`);
    } catch (error) {
        console.error('Error storing OTP:', error);
        throw error; // Propagate the error
    }
}

// Function to retrieve OTP from Redis
async function retrieveOTP(userId) {
    try {
        const otp = await getAsync(userId);
        return otp;
    } catch (error) {
        console.error('Error retrieving OTP:', error);
        throw error; // Propagate the error
    }
}

console.log(setAsync);
// const otp = generateOTP();
// console.log(otp);


// Example usage
// (async () => {
//     try {
//         const userId = 'user123';
//         const otp = generateOTP();
//         await storeOTP(userId, otp);
//         console.log("h");

//         // Retrieve stored OTP
//         const retrievedOTP = await retrieveOTP(userId);
//         console.log(`Retrieved OTP for user ${userId}: ${retrievedOTP}`);
        
//         // Close the Redis client when done
//         client.quit();
//     } catch (error) {
//         console.error('Error:', error);
//     }
// })();
