using Microsoft.AspNetCore.Mvc;

namespace Trade.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
