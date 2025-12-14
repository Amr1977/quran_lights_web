module.exports = {
    default: {
        require: ['tests/step_definitions/**/*.js'],
        format: [
            'progress',
            'html:tests/reports/cucumber-report.html',
            'json:tests/reports/cucumber-report.json'
        ],
        publishQuiet: true
    }
};
