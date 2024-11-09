const axios = require('axios');

const createScorecard = {
  "identifier": "open-prs-scorecard",
  "title": "Open PRs Status",
  "rules": [
    {
      "identifier": "gold-level-prs",
      "title": "Less than 5 open PRs",
      "description": "Repository has less than 5 open pull requests",
      "level": "Gold",
      "query": {
        "combinator": "and",
        "conditions": [
          {
            "property": "openPRsCount",
            "operator": "<",
            "value": 5
          }
        ]
      }
    },
    {
      "identifier": "silver-level-prs",
      "title": "Less than 10 open PRs",
      "description": "Repository has less than 10 open pull requests",
      "level": "Silver",
      "query": {
        "combinator": "and",
        "conditions": [
          {
            "property": "openPRsCount",
            "operator": "<",
            "value": 10
          }
        ]
      }
    },
    {
      "identifier": "bronze-level-prs",
      "title": "Less than 15 open PRs",
      "description": "Repository has less than 15 open pull requests",
      "level": "Bronze",
      "query": {
        "combinator": "and",
        "conditions": [
          {
            "property": "openPRsCount",
            "operator": "<",
            "value": 15
          }
        ]
      }
    }
  ],
  "levels": [
    {
      "title": "Gold",
      "color": "yellow"
    },
    {
      "title": "Silver",
      "color": "gray"
    },
    {
      "title": "Bronze",
      "color": "orange"
    }
  ]
};

// Configuration for the API request
const config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://api.getport.io/v1/blueprints/service/scorecards', // Assuming 'service' is the blueprint identifier
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'YOUR_API_KEY'
  },
  data: createScorecard
};

// Make the API request
axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });