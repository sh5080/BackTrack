import Constant from "../constant";

const state = {
  messageData: [],
};

const getters = {};

const actions = {};

const mutations = {
  [Constant.PUSH_message_DATA]: ($state, $payload) => {
    $state.messageData.push($payload);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
