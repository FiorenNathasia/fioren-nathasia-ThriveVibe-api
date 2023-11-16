/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("videos").del();
  await knex("videos").insert([
    {
      id: 1,
      user_id: 1,
      url: "https://youtube.com/shorts/vH7g8KRsbMo?si=6A1BuHPsD3EuIra2",
      prompt: "Did you like the composition of the vidoe?",
      upvote: 0,
      downvote: 0,
    },
    {
      id: 2,
      user_id: 1,
      url: "https://youtube.com/shorts/v7ihmJYSUgU?si=uQZA9j8MepUa-2CB",
      prompt: "Was the recipe something you would make at home?",
      upvote: 0,
      downvote: 0,
    },
    {
      id: 3,
      user_id: 1,
      url: "https://youtube.com/shorts/YrbMcqfbTTE?si=Ds75juy1wgOncClR",
      prompt: "Did you stay for aleast half the video?",
      upvote: 0,
      downvote: 0,
    },
  ]);
};
