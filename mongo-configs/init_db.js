
db = db.getSiblingDB('words')

db.createUser({
	user: "eesti_user",
	pwd: "eesti_pwd",
	customData: {},
	roles: [{
		role: "readWrite", 
		db: "words"
	}]


})

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
					enum: ["tegusõna", "nimisõna", "omadussõna", "asesõna"],
					description: "can only be one of the enum"
				},
				failed: {
					bsonType: "bool",
					description: "must be a boolean"
				}
			}
		}
	},
	validationLevel: "strict",
	validationAction: "error"
})

db.words.createIndex({firstCase: 1}, {unique: true})
