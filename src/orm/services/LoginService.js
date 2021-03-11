class LoginService {
    constructor(db) {
        this.db = db
    }
    login = async (formData, savedData) => {
        try {
            // TODO: Implement JSON webtokens into this
            if (await bcrypt.compare(formData.password, savedData.password)) {
                return { status: true }
            }
        }
        catch (error) {

        }
    }
}

module.exports = LoginService