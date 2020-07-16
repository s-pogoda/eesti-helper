
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

db.createCollection("verbs", {
	validator: {
		$jsonSchema: {
			bsonType: "object",
			required: [ "maInfinitive", "daInfinitive", "meForm", "translation"],
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
				failed: {
					bsonType: "bool",
					description: "must be a boolean"
				}
			}
		}
	},
	validationAction: "warn"
})

db.createCollection("nouns", {
        validator: {
                $jsonSchema: {
                        bsonType: "object",
                        required: [ "first", "second", "third", "translation"],
                        properties: {
                                first: {
                                        bsonType: "string",
                                        description: "must be a string and is required"
                                },
                                second: {
                                        bsonType: "string",
                                        description: "must be a string and is required"
                                },
                                third: {
                                        bsonType: "string",
                                        description: "must be a string and is required"
                                },
				translation: {
                                        bsonType: "string",
                                        description: "must be a string and is required"
                                },
				failed: {
                                        bsonType: "bool",
                                        description: "must be a boolean"
                                }
                        }
                }
        }
})


