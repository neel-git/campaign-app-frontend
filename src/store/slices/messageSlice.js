import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [
    {
      id: 1,
      campaignName: "Welcome Message",
      content:
        "Welcome to our practice management system! We're excited to have you here.",
      isRead: false,
      receivedAt: "2024-01-20T10:00:00Z",
    },
    {
      id: 2,
      campaignName: "Important Update",
      content:
        "This is a sample message for testing the inbox functionality...",
      isRead: true,
      receivedAt: "2024-01-19T15:30:00Z",
    },
    {
      id: 3,
      campaignName: "Important Update",
      content:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
      isRead: false,
      receivedAt: "2024-01-19T15:30:00Z",
    },
    {
      id: 4,
      campaignName: "Launch of Air Jordan",
      content:
        "The new movie Air tells the story of how Nike courted basketball player Michael Jordan, stealing him away from rivals Converse and Adidas. In a deal that gave the player his own shoe line – the Air Jordan – as well as points on every pair sold, it revolutionised sports marketing and turned around Nike’s fortunes. Air is directed by Ben Affleck, who also plays Nike co-founder and CEO Phil Knight. Affleck’s long-time collaborator Matt Damon plays Sonny Vaccaro, the middle-aged Nike exec who stakes his reputation on the then-unheard-of Chicago Bulls player. Ahead of its release, here’s ten takeaways from the story of the Air Jordan.",
      isRead: false,
      receivedAt: "2024-01-19T15:30:00Z",
    },
    // More sample messages for testing
  ],
};

export const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    markAsRead: (state, action) => {
      const message = state.messages.find((m) => m.id === action.payload);
      if (message && !message.isRead) {
        message.isRead = true;
      }
    },
  },
});

export const { markAsRead } = messageSlice.actions;
export default messageSlice.reducer;
