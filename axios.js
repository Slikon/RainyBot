const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const confirmLocation = async (location) => {
  let url = `https://eu1.locationiq.com/v1/search.php?key=${process.env.location_key}&q=${location}&format=json`;
  let res = await axios.get(url);
  let coord = await res.data[0].display_name;

  console.log(coord);
  console.log(process.env.BOT_TOKEN);
};

// ctx.telegram.sendMessage(
//   ctx.chat.id,
//   `Is ${await confirmLocation(globalLocation, ctx)} your location?`,
//   {
//     reply_markup: {
//       inline_keyboard: [
//         [{ text: 'Yes!', callback_data: 'correct_location' }],
//         [{ text: 'False! Try again!', callback_data: 'false_location' }],
//       ],
//     },
//   }
// );

confirmLocation('Kiev');
