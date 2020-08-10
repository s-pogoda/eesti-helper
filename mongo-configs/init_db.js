
db = db.getSiblingDB('words');

db.createUser({
	user: "eesti_user",
	pwd: "eesti_pwd",
	customData: {},
	roles: [{
		role: "readWrite", 
		db: "words"
	}]


});

db.createCollection("words", {
	validator: {
		$jsonSchema: {
			bsonType: "object",
			required: [ "firstCase", "secondCase", "thirdCase", "translation", "type"],
			properties: {
				firstCase: {
					bsonType: "string",
					description: "must be a string and is required"
				},
				secondCase: {
					bsonType: "string",
					description: "must be a string and is required"
				},
				thirdCase: {
					bsonType: "string",
					description: "must be a string and is required"
				},
				translation: {
					bsonType: ["array"],
					minItem: 1,
					uniqueItems: true,
					additionalProperties: false,
					item: {
						bsonType: "string",
						description: "must be a string and is required"
					}
				},
				type: {
					bsonType: "string",
					description: "must be a string and is required"
				},
				failed: {
					bsonType: "bool",
					description: "must be a boolean"
				},
				tags: {
					bsonType: ["array"],
					minItem: 0,
					uniqueItems: true,
					item: {
						bsonType: "string",
						description: "must be a string"
					}
				}
			}
		}
	},
	validationLevel: "strict",
	validationAction: "error"
});

db.words.createIndex({firstCase: 1}, {unique: true});

db.createCollection("tags", {
	validator: {
		$jsonSchema: {
			bsonType: "object",
			required: ["tag"],
			properties: {
				tag: {
					bsonType: "string",
					description: "must be a string"
				}
			}
		}
	},
	validationLevel: "strict",
	validationAction: "error"
});

db.tags.createIndex({tag: 1}, {unique: true});
