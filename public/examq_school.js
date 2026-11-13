/* Maths exam questions from Josh's school booklets (Year 11 Higher KO booklets 1 & 2, AO2/AO3 questions)
   plus worked examples from the Year 10 knowledge organisers. Mark schemes written to match AQA style. */
(function () {
  const X = (t, m, calc, q, ms) => window.EXAMQ.push({ s: "maths", t, m, q, ms: ms.split(" | "), src: 1, calc });
  X("Sequences (nth term)", 3, "n", "Patterns are made using sticks. Pattern 1 is a square with one diagonal (5 sticks); each new pattern adds another square with a diagonal (4 more sticks). (a) Show that the first five patterns use a total of 65 sticks. (b) Work out the nth term of the sequence.",
    "Sequence 5, 9, 13, 17, 21 | 5 + 9 + 13 + 17 + 21 = 65 | nth term = 4n + 1");
  X("Sequences (nth term)", 3, "n", "The first two terms of a quadratic sequence are 10 and 17. The first differences are +7 and +13, and the second difference is constant. Work out an expression for the nth term.",
    "Second difference 6, so 3n² | Subtract 3n² from 10, 17, 30 → 7, 5, 3 so −2n + 9 | nth term = 3n² − 2n + 9");
  X("Solving quadratics", 2, "n", "Jo wants to work out the solutions of x² + 3x − 5 = 0. She says, \"The solutions cannot be worked out because x² + 3x − 5 does not factorise to (x + a)(x + b) where a and b are integers.\" Is Jo correct? Give a reason.",
    "No | You can use the quadratic formula / completing the square, e.g. x = (−3 ± √29) ÷ 2");
  X("Solving equations", 5, "n", "Six rods have lengths 2(2x + 1) cm, (2x + 7) cm, (2x + 3) cm, (x + 4) cm, (3x − 2) cm and (2x − 1) cm. The two longest rods, 2(2x + 1) and (2x + 7), are the same length. Use algebra to show how the six rods can be fitted together to make a quadrilateral with equal sides.",
    "4x + 2 = 2x + 7 | x = 2.5 | Lengths 12, 12, 8, 6.5, 5.5, 4 | 8 + 4 = 12 and 6.5 + 5.5 = 12 | So four sides of 12 cm: a rhombus/square");
  X("Direct & inverse proportion", 1, "n", "m is inversely proportional to √r. The value of r is multiplied by 4. What happens to m? Choose: ×2, ×16, ÷2, ÷16.",
    "÷2 (√4 = 2, and inverse means divide)");
  X("Direct & inverse proportion", 3, "n", "To complete a task in 15 days a company needs 4 people each working for 8 hours per day. The company decides to have 5 people each working for 6 hours per day. Assume each person works at the same rate. How many days will the task take to complete?",
    "Total work = 15 × 4 × 8 = 480 person-hours | 5 × 6 = 30 hours per day | 480 ÷ 30 = 16 days");
  X("Volume & surface area", 3, "n", "The net of a cuboid has faces with areas 12 cm², 15 cm² and 20 cm² (each appearing twice). Work out the volume of the cuboid.",
    "Find dimensions with ab = 12, ac = 15, bc = 20 | 3 cm × 4 cm × 5 cm | Volume = 60 cm³");
  X("Powers, roots & standard form", 3, "n", "a × 10⁴ + a × 10² = 24 240, where a is a number. Work out a × 10⁴ − a × 10². Give your answer in standard form.",
    "a × 10 100 = 24 240, so a = 2.4 | 24 000 − 240 = 23 760 | 2.376 × 10⁴");
  X("Powers, roots & standard form", 3, "n", "A patient has 4³ body cells affected on day 1. The number of affected cells doubles every day. The disease becomes serious when 2¹⁰ body cells are affected. On which day does the disease become serious?",
    "4³ = 2⁶ | Doubling adds 1 to the power each day: 2⁶ day 1, 2⁷ day 2 … | 2¹⁰ on day 5");
  X("Probability & Venn diagrams", 2, "n", "Bag A contains 20 green balls and 12 yellow balls. Bag B contains 15 green balls and 9 yellow balls. John says, \"It's more likely that a green ball is chosen from Bag A than Bag B because there are more green balls in Bag A.\" Is he correct? Give a reason.",
    "No | P(green) = 20/32 = 5/8 and 15/24 = 5/8, so the probabilities are the same");
  X("Tree diagrams & conditional probability", 3, "n", "Greg has up to three jumps to qualify for a long jump final. If he jumps at least 7.5 m he does not jump again. Each jump, the probability he jumps at least 7.5 m is 0.8, and jumps are independent. Work out the probability that Greg qualifies.",
    "Qualify on 1st: 0.8; on 2nd: 0.2 × 0.8 = 0.16; on 3rd: 0.2 × 0.2 × 0.8 = 0.032 | Add: 0.8 + 0.16 + 0.032 | 0.992 (or 1 − 0.2³)");
  X("Trigonometry", 3, "y", "A Big Wheel is a circle with centre O and radius 15 m. The lowest point B of the wheel is 2 m above horizontal ground. C is a point on the wheel, h metres above the ground, and angle COB = x°. Show that h = 17 − 15 cos x°.",
    "Centre O is 15 + 2 = 17 m above the ground | Vertical distance from O down to the level of C = 15 cos x | h = 17 − 15 cos x");
  X("Quadratic graphs", 2, "n", "Erika sketches the graph of y = 1/x (x ≠ 0). Her sketch has both branches above the x-axis and touching the y-axis. Make two different criticisms of her sketch.",
    "For negative x, y should be negative (branch in the bottom-left quadrant) | The curve should never touch the axes (they are asymptotes)");
  X("Quadratic graphs", 3, "n", "A graph has the equation y = x² + px + r, where p and r are constants. The graph passes through (0, 4), (1, 3) and (8, w). Work out the value of w.",
    "(0, 4) gives r = 4 | (1, 3): 1 + p + 4 = 3 so p = −2 | w = 64 − 16 + 4 = 52");
  X("Volume & surface area", 4, "y", "(a) A cylinder has radius 6 cm and height 15 cm. Work out its volume. (b) 1000 cm³ = 1 litre. A tank contains 45 000 cm³ of water and leaks at 0.75 litres per minute. How long does the tank take to empty?",
    "π × 6² × 15 | 1696.5 cm³ (540π) | 45 000 cm³ = 45 litres | 45 ÷ 0.75 = 60 minutes");
  X("Volume & surface area", 4, "y", "Volume of a sphere = 4/3 πr³. (a) Work out the volume of a sphere of radius 6 cm. (b) Four spheres of radius 6 cm are packed tightly in a row into a cuboid. Work out the volume of the cuboid.",
    "4/3 × π × 216 | 904.8 cm³ (288π) | Cuboid 48 cm × 12 cm × 12 cm | 6912 cm³");
  X("Percentage change & reverse %", 1, "n", "In year 1 the value of a watch increases by 12%. In year 2 the value increases by the same amount of money as in year 1. Which multiplier can be used with the original value to work out the value at the end of year 2? Choose: 1.12, 1.24, 1.12², 1.24².",
    "1.24 (two lots of 12% of the original value)");
  X("Charts & frequency tables", 4, "y", "A pie chart shows primary school teachers in 15 074 schools. The male sector is 50°; the rest are female. The mean number of teachers per school is 13.7. Work out the total number of female teachers in these schools. Give your answer to 2 significant figures.",
    "Total teachers = 15 074 × 13.7 = 206 513.8 | Female fraction = 310/360 | 177 831… | 180 000 (2 s.f.)");
  X("Ratio & proportion", 3, "n", "There are 200 students in Year 10 and 110 are boys. There are 250 students in Year 11 and 140 are boys. Which year has the greater proportion of boys? You must show your working.",
    "110/200 = 0.55 (55%) | 140/250 = 0.56 (56%) | Year 11");
  X("Simultaneous equations", 3, "n", "The sum of two numbers is 15. The difference of the same two numbers is 8. Use algebra to work out the numbers.",
    "x + y = 15 and x − y = 8 | 2x = 23 so x = 11.5 | y = 3.5");
  X("Completing the square (H)", 3, "n", "The turning point of the graph y = (x + a)² + b has x-coordinate −2. (3, 1) is another point on the graph. Work out the y-coordinate of the turning point.",
    "Turning point x = −a so a = 2 | 1 = (3 + 2)² + b = 25 + b | b = −24, so y-coordinate −24");
  X("Vectors", 2, "n", "ABCD is a parallelogram. ABE is a straight line and AB : BE = 4 : 3. AB = a and AD = b. Work out ED in terms of a and b. Give your answer in its simplest form.",
    "AE = 7/4 a | ED = −7/4 a + b (= b − 7/4 a)");
  X("Vectors", 4, "n", "ABC and ACD are triangles. BA = ka, AC = 3b and AD = 6a + 7.5b, where k is a constant. BCD is a straight line. (a) Show that CD = 6a + 4.5b. (b) Work out the value of k.",
    "CD = CA + AD = −3b + 6a + 7.5b = 6a + 4.5b | BC = BA + AC = ka + 3b | BC parallel to CD: 6a + 4.5b = 1.5(4a + 3b) | k = 4");
  X("Constructions & loci", 2, "n", "Joe wants to bisect angle BCD. His method: use compasses to draw arcs of the same radius from B and D, then draw a straight line from C through the intersection of the arcs. Write down the error in his method.",
    "B and D are not the same distance from C | He should first draw an arc centred on C to mark equal distances on both arms, then draw arcs from those points");
  X("Constructions & loci", 2, "n", "ABCD is a garden. A tree is to be planted in the region that is closer to AB than to BC. Describe how to construct the region R.",
    "Construct the bisector of angle ABC with compasses (arcs from B, then equal arcs from where they cross the arms) | R is the region between the bisector and AB, inside the garden");
  X("Simple & compound interest, growth & decay", 3, "y", "There are 540 grey squirrels in a forest. The population increases by 10% each year. After how many years will the population double?",
    "Multiplier 1.1 | 540 × 1.1⁷ = 1052 (not yet 1080), 540 × 1.1⁸ = 1158 | Just over 7 years (doubles during year 8)");
  X("Simple & compound interest, growth & decay", 4, "y", "The value of a car is £25 000. The value decreases by 22% each year. (a) Write a formula for the value after n years. (b) Find the value after 8 years.",
    "Multiplier 0.78 | V = 25 000 × 0.78ⁿ | 25 000 × 0.78⁸ | £3425 (nearest £)");
})();
