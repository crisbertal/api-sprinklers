

const { validateAll } = use("Validator");
async function ValidationHelper(request, response, validators, messages) {
    //START REQUEST VALIDATION
    const validation = await validateAll(request.all(), validators, messages);
    let errores = '';
    if (validation.fails()) {
        validation.messages().forEach((element) => {
            errores += element.message + ",";
        });
    }
    return errores;
    //END REQUEST VALIDATION
}

module.exports = { ValidationHelper };