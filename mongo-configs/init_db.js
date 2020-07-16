
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
				maInfinitive: {
					bsonType: "string",
					description: "must be a string and is required"
				},
				daInfinitive: {
					bsonType: "string",
					description: "must be a string and is required"
				},
				meForm: {
					bsonType: "string",
					description: "must be a string and is required"
				},
				translation: {
					bsonType: "string",
					description: "must be a string and is required"
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
	validationAction: "warn"
})

db.words.createIndex({firstCase: 1}, {unique: true})
