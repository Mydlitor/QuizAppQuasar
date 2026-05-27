const routes = [
    {
        path: "/",
        component: () => import("src/views/MenuView.vue"),
    },
    {
        path: "/game",
        component: () => import("src/views/GameView.vue"),
    },
];

export default routes;
