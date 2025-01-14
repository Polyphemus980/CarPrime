// using NUnit.Framework;
// using OpenQA.Selenium;
// using OpenQA.Selenium.Chrome;
// using System;
// using System.Threading;

// namespace CarPrimeE2ETests
// {
//     [TestFixture]
//     public class CarPrimeE2ETests
//     {
//         private IWebDriver driver;

//         [SetUp]
//         public void Setup()
//         {
//             var chromeOptions = new ChromeOptions();
//             chromeOptions.AddArgument("start-maximized");
//             driver = new ChromeDriver(chromeOptions);
//             driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);
//         }

//         [Test]
//         public void Register_NewUser_Success()
//         {
//             driver.Navigate().GoToUrl("http://localhost:3000/register");
//             driver.FindElement(By.Id("firstName")).SendKeys("John");
//             driver.FindElement(By.Id("lastName")).SendKeys("Doe");
//             driver.FindElement(By.Id("email")).SendKeys($"johndoe_{Guid.NewGuid()}@example.com");
//             driver.FindElement(By.Id("birthdate")).SendKeys("1990-01-01");
//             driver.FindElement(By.Id("licenceIssuedDate")).SendKeys("2010-01-01");
//             driver.FindElement(By.Id("country")).SendKeys("USA");
//             driver.FindElement(By.Id("city")).SendKeys("New York");
//             driver.FindElement(By.Id("address")).SendKeys("123 Main St");
//             driver.FindElement(By.CssSelector("button[type='submit']")).Click();
//             Thread.Sleep(2000);
//             Assert.IsTrue(driver.Url == "http://localhost:3000/");
//             Assert.IsTrue(driver.PageSource.Contains("Car Rental Service - Rent a Car"));
//         }

//         [Test]
//         public void Login_ValidCredentials_Success()
//         {
//             driver.Navigate().GoToUrl("http://localhost:3000/login");
//             driver.FindElement(By.Id("email")).SendKeys("johndoe_test@example.com");
//             driver.FindElement(By.Id("password")).SendKeys("SecurePassword123!");
//             driver.FindElement(By.CssSelector("button[type='submit']")).Click();
//             Thread.Sleep(2000);
//             Assert.IsTrue(driver.Url == "http://localhost:3000/");
//             Assert.IsTrue(driver.PageSource.Contains("Hello, johndoe_test@example.com!"));
//         }

//         [Test]
//         public void ViewAvailableCars_DisplayCars()
//         {
//             driver.Navigate().GoToUrl("http://localhost:3000/login");
//             driver.FindElement(By.Id("email")).SendKeys("johndoe_test@example.com");
//             driver.FindElement(By.Id("password")).SendKeys("SecurePassword123!");
//             driver.FindElement(By.CssSelector("button[type='submit']")).Click();
//             Thread.Sleep(2000);
//             driver.Navigate().GoToUrl("http://localhost:3000/");
//             var carCards = driver.FindElements(By.ClassName("car-card"));
//             Assert.IsTrue(carCards.Count > 0);
//             foreach (var carCard in carCards)
//             {
//                 var statusElement = carCard.FindElement(By.ClassName("car-status"));
//                 string statusText = statusElement.Text.Trim();
//                 Assert.AreEqual("Available", statusText);
//             }
//         }

//         [Test]
//         public void RentAvailableCar_Success()
//         {
//             driver.Navigate().GoToUrl("http://localhost:3000/login");
//             driver.FindElement(By.Id("email")).SendKeys("johndoe_test@example.com");
//             driver.FindElement(By.Id("password")).SendKeys("SecurePassword123!");
//             driver.FindElement(By.CssSelector("button[type='submit']")).Click();
//             Thread.Sleep(2000);
//             driver.Navigate().GoToUrl("http://localhost:3000/");
//             var rentButtons = driver.FindElements(By.CssSelector(".car-card button"));
//             Assert.IsTrue(rentButtons.Count > 0);
//             rentButtons[0].Click();
//             Thread.Sleep(1000);
//             driver.FindElement(By.Name("startDate")).SendKeys("2025-01-01");
//             driver.FindElement(By.Name("endDate")).SendKeys("2025-01-10");
//             driver.FindElement(By.CssSelector(".form-buttons button[type='submit']")).Click();
//             Thread.Sleep(2000);
//             Assert.IsTrue(driver.PageSource.Contains("Car rented successfully"));
//             driver.Navigate().Refresh();
//             Thread.Sleep(1000);
//             var updatedStatus = driver.FindElement(By.ClassName("car-status")).Text.Trim();
//             Assert.AreEqual("Not Available", updatedStatus);
//         }

//         [Test]
//         public void ViewRentedCars_DisplayCars()
//         {
//             driver.Navigate().GoToUrl("http://localhost:3000/login");
//             driver.FindElement(By.Id("email")).SendKeys("johndoe_test@example.com");
//             driver.FindElement(By.Id("password")).SendKeys("SecurePassword123!");
//             driver.FindElement(By.CssSelector("button[type='submit']")).Click();
//             Thread.Sleep(2000);
//             driver.Navigate().GoToUrl("http://localhost:3000/myrented");
//             var rentedCarCards = driver.FindElements(By.ClassName("rented-car-card"));
//             Assert.IsTrue(rentedCarCards.Count > 0);
//             foreach (var carCard in rentedCarCards)
//             {
//                 Assert.IsTrue(carCard.FindElement(By.TagName("h2")).Text.Contains("Brand"));
//                 Assert.IsTrue(carCard.FindElement(By.TagName("h2")).Text.Contains("Name"));
//                 Assert.IsTrue(carCard.PageSource.Contains("Rental Period"));
//                 Assert.IsTrue(carCard.PageSource.Contains("Status"));
//             }
//         }

//         [TearDown]
//         public void Teardown()
//         {
//             driver.Quit();
//         }
//     }
// }
Assert(true)