const restrictedPaths = ["/topics", "/quiz"]

const authMiddleware = async (context, next) => {
    const user = await context.state.session.get("user");

    if (user) {
        context.user = user;
    }

    if (
        !user && restrictedPaths.some((path) =>
        context.request.url.pathname.startsWith(path)
        )
    ) {  
        context.response.redirect("/auth/login");
    } else {
        await next();
    }
};

export { authMiddleware };