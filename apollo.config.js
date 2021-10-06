module.exports = {
    client: {
        includes: ["./screens/*.{tsx,ts}", "./components/**/*.{tsx,ts}", "./hooks/*.{tsx,ts}"],
        tagName: "gql",
        service: {
            name: "instaclone-backend",
            url: "http://localhost:4000/graphql",
        },
    }
};