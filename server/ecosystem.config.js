module.exports = {
    apps: [
        {
            name: "TaskPulse",
            script: "npm",
            args: "run dev",
            env: {
                NODE_ENV: "development"
            }
        }
    ]
}