const schema = {
  type: 'object',
  properties: {
    category: {
      type: 'string',
      enum: ['Front end', 'Back end', 'UI/UX']
    },
    body: {
      type: 'string',
      minLength: 50,
      maxLength: 500
    }
  }
};

module.exports = schema;