import axios from 'axios';

export const fetchContest = contestId => (
  axios.get(`/api/contests/${contestId}`) 
    .then(resp => resp.data)
);

export const fetchContestList = () => (
  axios.get('/api/contests/') 
    .then(resp => resp.data.contests)
);
