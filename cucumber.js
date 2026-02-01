module.exports = {
    default: {
        paths: ['src/features/**/*.feature'],
        requireModule: ['ts-node/register'],
        require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
        format: ['progress', 'html:reports/cucumber-report.html']
    },
    ui: {
        paths: ['src/features/**/*.feature'],
        requireModule: ['ts-node/register'],
        require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
        tags: '@UI',
        format: ['progress', 'html:reports/ui-report.html']
    },
    api: {
        paths: ['src/features/**/*.feature'],
        requireModule: ['ts-node/register'],
        require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
        tags: '@API',
        format: ['progress', 'html:reports/api-report.html']
    },
    full: {
        paths: ['src/features/**/*.feature'],
        requireModule: ['ts-node/register'],
        require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
        format: ['progress', 'html:reports/full-report.html', 'json:reports/report.json']
    }
}
