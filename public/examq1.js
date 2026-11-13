/* Exam-style written questions. Format: [marks, question, "mark point | mark point | ..."] */
window.EXAMQ = window.EXAMQ || [];
window.EX = function (s, t, list) { list.forEach(([m, q, ms]) => window.EXAMQ.push({ s, t, m, q, ms: ms.split(" | ") })); };

EX("bio", "Cells & microscopy", [
  [3, "Describe three differences between a prokaryotic cell and a eukaryotic cell.", "Prokaryotes have no nucleus; DNA is free in the cytoplasm | Prokaryotes may have plasmids | Prokaryotes are smaller | Prokaryotes have no mitochondria / membrane-bound organelles"],
  [2, "Explain why muscle cells contain lots of mitochondria.", "Mitochondria are the site of aerobic respiration | They release energy needed for muscle contraction"],
  [4, "Compare light microscopes and electron microscopes.", "Electron microscopes have higher magnification | Electron microscopes have higher resolution | Electron microscopes can see sub-cellular structures like ribosomes | Light microscopes can view living samples and are cheaper"],
  [2, "State the function of ribosomes and of the cell wall.", "Ribosomes: site of protein synthesis | Cell wall: made of cellulose, strengthens and supports the cell"],
]);
EX("bio", "Enzymes", [
  [3, "Explain why enzymes stop working at high temperatures.", "The active site changes shape / the enzyme is denatured | The substrate no longer fits the active site | So no enzyme-substrate complexes form"],
  [2, "Describe the lock-and-key model.", "The substrate is complementary in shape to the active site | It binds to form an enzyme-substrate complex"],
  [6, "Describe how you would investigate the effect of pH on the rate of amylase activity.", "Use buffer solutions at a range of pH values | Mix amylase, starch and buffer in a water bath at a constant temperature | Take samples at regular intervals (e.g. every 30 s) | Add to iodine on a spotting tile | Record the time until iodine no longer turns blue-black | Repeat and calculate the mean; rate = 1/time"],
  [2, "Name the enzyme that breaks down protein and the product formed.", "Protease | Amino acids"],
]);
EX("bio", "Diffusion, osmosis & active transport", [
  [2, "Define osmosis.", "Movement of water across a partially permeable membrane | From a dilute solution to a more concentrated one (high to low water potential)"],
  [3, "Explain how root hair cells take up mineral ions.", "By active transport | Against the concentration gradient | Needs energy from respiration (lots of mitochondria)"],
  [6, "Describe how you would investigate osmosis in potato cylinders.", "Cut equal-size potato cylinders with a cork borer | Blot and weigh each one | Place in a range of sucrose concentrations | Leave for a set time at the same temperature | Blot and reweigh | Calculate the percentage change in mass and plot against concentration"],
  [3, "Give three factors that increase the rate of diffusion.", "Larger concentration gradient | Higher temperature | Larger surface area / thinner membrane"],
]);
EX("bio", "Cell division & stem cells", [
  [4, "Describe the stages of the cell cycle and mitosis.", "Interphase: the cell grows and DNA replicates | Organelles such as mitochondria increase | Mitosis: chromosomes line up and are pulled apart | Cytokinesis: the cytoplasm divides into two identical cells"],
  [4, "Evaluate the use of embryonic stem cells in medicine.", "Pro: can become any cell type | Pro: could treat diseases like diabetes or paralysis | Con: ethical/religious objection to destroying embryos | Con: risk of rejection or cancer / viral contamination"],
  [2, "Where are stem cells found in plants, and what is useful about them?", "Meristems (root and shoot tips) | They can make clones of plants quickly and cheaply / produce any plant cell type"],
]);
EX("bio", "Nervous system & brain", [
  [6, "Describe the pathway of a reflex arc when you touch a hot object.", "Receptor in the skin detects the stimulus | Impulse travels along a sensory neurone | to a relay neurone in the spinal cord | then along a motor neurone | Effector (muscle) contracts and pulls the hand away | Automatic and fast; doesn't involve the conscious brain"],
  [3, "Explain how a nerve impulse crosses a synapse.", "The impulse reaches the end of the neurone and neurotransmitter is released | It diffuses across the gap | It binds to receptors on the next neurone, triggering an impulse"],
  [2, "Explain why it is difficult to treat damage to the brain.", "The brain is complex and delicate, and it's hard to know which area is damaged | Treatments may damage other areas / the brain is hard to access"],
]);
EX("bio", "Reproduction & DNA", [
  [3, "Explain why gametes need half the normal number of chromosomes.", "Gametes are haploid (23 chromosomes) | At fertilisation two gametes fuse | The zygote has the full diploid number (46)"],
  [4, "Compare sexual and asexual reproduction.", "Sexual needs two parents; asexual needs one | Sexual involves gametes / meiosis; asexual uses mitosis | Sexual gives variation; asexual gives clones | Asexual is faster / needs no mate"],
  [3, "Describe the structure of DNA.", "Polymer made of nucleotides | Two strands in a double helix | Complementary bases A–T and C–G joined by weak hydrogen bonds"],
]);
EX("bio", "Inheritance & variation", [
  [4, "Cystic fibrosis is caused by a recessive allele (f). Two carrier parents (Ff) have a child. Use a Punnett square to find the probability the child has CF.", "Correct gametes: F, f and F, f | Offspring FF, Ff, Ff, ff | ff has CF | Probability 1/4 / 25%"],
  [2, "Define 'genotype' and 'phenotype'.", "Genotype: the alleles an organism has, e.g. Bb | Phenotype: the observable characteristics"],
  [3, "Explain why identical twins can still differ in some characteristics.", "They have the same genes / DNA | Differences are due to the environment | e.g. diet causing differences in weight, or scars"],
]);
EX("bio", "Evolution & classification", [
  [5, "Explain how bacteria become resistant to antibiotics.", "Random mutation creates resistance in some bacteria | Antibiotic kills the non-resistant bacteria | Resistant bacteria survive | and reproduce, passing on the allele | Population of resistant bacteria increases (natural selection)"],
  [3, "Describe the evidence from stone tools for human evolution.", "Tools become more complex over time | Dated using the rock layers they're found in (stratigraphy) / carbon dating | Shows increasing brain size / skill"],
  [2, "Why was the three-domain system introduced?", "Chemical analysis (RNA) showed some organisms are more different than thought | Archaea are separate from bacteria"],
]);
EX("bio", "Selective breeding & GM", [
  [4, "Describe how a farmer could selectively breed cows with a high milk yield.", "Choose parents with the highest milk yield | Breed them together | Select the best offspring and breed them | Repeat over many generations"],
  [4, "Describe how bacteria are genetically engineered to make human insulin.", "Insulin gene cut from human DNA with restriction enzymes | Plasmid cut with the same enzyme, giving sticky ends | Gene inserted using ligase | Plasmid put into bacteria, which multiply and make insulin"],
  [3, "Give arguments for and against GM crops.", "For: higher yields / pest resistance / more nutrients (golden rice) | Against: genes could spread to wild plants | Against: unknown long-term effects / less biodiversity"],
]);
EX("bio", "Health, disease & immunity", [
  [4, "Explain how a vaccination protects you from a disease.", "Contains dead/inactive pathogen or its antigens | White blood cells (lymphocytes) produce antibodies | Memory lymphocytes are made | On reinfection, antibodies are made faster and in larger amounts"],
  [3, "Describe how the body's physical and chemical barriers stop pathogens.", "Skin is a physical barrier | Mucus and cilia trap and move pathogens | Stomach acid / lysozyme in tears kills pathogens"],
  [3, "Name a disease caused by a virus and describe how it spreads and is controlled.", "e.g. HIV, measles or ebola | Spread: bodily fluids / droplets | Control: condoms/screening, vaccination, isolation"],
  [2, "Explain why antibiotics can't be used to treat viral infections.", "Antibiotics kill bacteria | Viruses live inside cells, so antibiotics can't reach them without damaging cells"],
]);
EX("bio", "Medicines & plant defences", [
  [4, "Describe the stages of developing a new drug.", "Discovery / development | Preclinical tests on cells and animals | Clinical trials on healthy volunteers at low doses | then on patients; double-blind with placebo"],
  [3, "Describe how plants defend themselves against pathogens.", "Physical: waxy cuticle / cell walls | Chemical: antibacterial chemicals | Chemical: poisons deter herbivores"],
  [2, "What is a double-blind trial and why is it used?", "Neither doctors nor patients know who gets the drug | Removes bias"],
]);
EX("bio", "Photosynthesis & limiting factors", [
  [2, "Write the word equation for photosynthesis.", "Carbon dioxide + water → | glucose + oxygen (using light energy)"],
  [3, "Explain why the rate of photosynthesis stops increasing as light intensity increases further.", "Rate levels off | Another factor becomes limiting | e.g. CO₂ concentration or temperature"],
  [3, "Explain how a farmer could increase crop growth in a greenhouse.", "Paraffin heater raises temperature and adds CO₂ | Artificial lighting | Must balance the cost against the increased yield"],
]);
EX("bio", "Leaf structure, xylem & phloem", [
  [4, "Compare xylem and phloem.", "Xylem carries water and minerals; phloem carries sugars (sucrose) | Xylem flow is one way (up); phloem is both ways | Xylem is dead cells with lignin; phloem is living cells | Phloem: translocation"],
  [3, "Explain how the leaf is adapted for photosynthesis.", "Palisade cells are packed with chloroplasts near the top surface | Air spaces in the spongy layer for gas exchange | Stomata let CO₂ in; thin for short diffusion distance"],
]);
EX("bio", "Transpiration & mineral ions", [
  [3, "Explain why the transpiration rate increases on a hot, windy day.", "Water evaporates faster at higher temperature | Wind removes water vapour from around the leaf | Steeper concentration gradient, so faster diffusion out of the stomata"],
  [4, "Describe how a potometer is used to measure transpiration rate.", "Cut the shoot underwater and set up the apparatus airtight | Introduce an air bubble | Measure the distance the bubble moves in a set time | Change one variable (e.g. fan/light) and repeat"],
  [2, "Why do plants need nitrate ions?", "To make amino acids / proteins | for growth"],
]);
EX("bio", "Reflexes & the eye", [
  [3, "Describe how the eye focuses on a near object.", "Ciliary muscles contract | Suspensory ligaments slacken | Lens becomes fatter / more convex, refracting light more"],
  [2, "Describe how the pupil responds to bright light.", "Circular muscles of the iris contract, radial muscles relax | Pupil gets smaller, letting less light in"],
  [3, "Describe the cause and correction of short-sightedness.", "Light focuses in front of the retina | Eyeball too long / lens too strong | Corrected with a concave (diverging) lens"],
]);
EX("bio", "Hormones & blood glucose", [
  [4, "Explain how blood glucose concentration is lowered after a meal.", "Pancreas detects the rise in glucose | Releases insulin | Liver and muscle cells take up glucose | Converted to glycogen for storage"],
  [3, "Compare nervous and hormonal responses.", "Nervous: electrical impulses; hormonal: chemicals in the blood | Nervous is faster | Hormonal effects last longer / are more widespread"],
]);
EX("bio", "Diabetes", [
  [4, "Compare type 1 and type 2 diabetes.", "Type 1: pancreas doesn't produce enough insulin | Type 1 treated with insulin injections | Type 2: body cells no longer respond to insulin | Type 2 treated with diet / exercise; linked to obesity"],
  [3, "Explain how waist:hip ratio can be used to assess the risk of type 2 diabetes.", "Calculate waist ÷ hip | A higher ratio means more abdominal fat | Linked to greater risk (above ~0.9 men / 0.85 women)"],
]);
EX("bio", "Temperature control", [
  [4, "Describe how the body responds when it gets too hot.", "Thermoregulatory centre (hypothalamus) detects the change | Sweating; evaporation transfers heat | Vasodilation: blood vessels near the skin widen | More heat lost by radiation"],
  [3, "Explain how shivering helps when cold.", "Muscles contract rapidly | Increases respiration | which releases heat"],
]);
EX("bio", "Menstrual cycle", [
  [4, "Describe the roles of FSH, LH, oestrogen and progesterone.", "FSH: causes an egg to mature | LH: triggers ovulation | Oestrogen: builds up the uterus lining, inhibits FSH | Progesterone: maintains the uterus lining"],
  [3, "Describe how IVF is carried out.", "FSH and LH given to stimulate several eggs | Eggs collected and fertilised with sperm in the lab | Embryos implanted into the uterus"],
  [3, "Compare hormonal and barrier methods of contraception.", "Hormonal (pill) more effective | Barrier (condoms) protects against STIs | Hormonal can have side effects"],
]);
EX("bio", "Gas exchange & breathing", [
  [4, "Explain how the alveoli are adapted for gas exchange.", "Large surface area | Thin walls (one cell thick), so short diffusion distance | Good blood supply maintains the concentration gradient | Moist lining"],
  [3, "Describe what happens during inhalation.", "Intercostal muscles contract, ribs move up and out | Diaphragm contracts and flattens | Volume increases, pressure drops, air is drawn in"],
]);
EX("bio", "Heart, blood & vessels", [
  [4, "Describe the pathway of blood through the heart from the body.", "Vena cava to the right atrium | to the right ventricle, then the pulmonary artery to the lungs | Pulmonary vein to the left atrium | Left ventricle to the aorta"],
  [3, "Explain why the left ventricle wall is thicker than the right.", "More muscle | Pumps blood at higher pressure | around the whole body (the right only pumps to the lungs)"],
  [4, "Compare arteries, veins and capillaries.", "Arteries: thick muscular/elastic walls, high pressure | Veins: thin walls, large lumen, valves | Capillaries: one cell thick for exchange | Arteries carry blood away from the heart, veins towards it"],
  [2, "Calculate cardiac output if heart rate is 70 bpm and stroke volume is 80 cm³.", "Cardiac output = heart rate × stroke volume | 5600 cm³/min"],
]);
EX("bio", "Respiration & exercise", [
  [4, "Compare aerobic and anaerobic respiration in humans.", "Aerobic uses oxygen; anaerobic doesn't | Aerobic produces CO₂ + water; anaerobic produces lactic acid | Aerobic releases more energy | Anaerobic happens during vigorous exercise"],
  [3, "Explain why breathing rate stays high after exercise.", "Oxygen debt | Lactic acid must be broken down | Needs oxygen; it is taken to the liver"],
  [2, "Give the word equation for anaerobic respiration in yeast.", "Glucose → | ethanol + carbon dioxide"],
]);
EX("bio", "Ecosystems & food chains", [
  [3, "Explain why only about 10% of energy is passed to the next trophic level.", "Energy used in respiration / movement | Lost as heat | Not all of the organism is eaten or digested (lost in faeces)"],
  [4, "Explain how a decrease in the number of rabbits could affect foxes and grass.", "Fewer rabbits means less food for foxes | Fox numbers decrease | Less grazing | so grass increases"],
  [2, "Name two abiotic factors that affect a community.", "Any two: temperature, light, water, pH, CO₂ / O₂ levels"],
]);
EX("bio", "Quadrats & transects", [
  [3, "Describe how you'd estimate the population of daisies in a field.", "Place quadrats at random (random number coordinates) | Count the daisies in each and calculate the mean per m² | Multiply by the area of the field"],
  [2, "A mean of 4 daisies per 0.25 m² quadrat. The field is 2000 m². Estimate the population.", "16 per m² | 32 000"],
]);
EX("bio", "Material cycles & decomposition", [
  [4, "Describe how carbon is cycled.", "Photosynthesis removes CO₂ from the air | Respiration returns CO₂ | Decomposers break down dead matter, releasing CO₂ | Combustion of fossil fuels releases CO₂"],
  [3, "Explain how the nitrogen cycle provides nitrates for plants.", "Decomposers turn proteins into ammonia | Nitrifying bacteria turn ammonia into nitrates | Nitrogen-fixing bacteria in root nodules fix N₂"],
  [3, "Explain why compost heaps decay faster when warm, moist and turned.", "Warm: enzymes in microorganisms work faster | Moist: needed for microorganisms | Turning provides oxygen for aerobic respiration"],
]);
EX("bio", "Biodiversity", [
  [4, "Describe ways humans reduce biodiversity and ways to protect it.", "Deforestation / habitat loss | Pollution / eutrophication | Breeding programmes / protected areas | Reforestation / reducing waste"],
  [3, "Explain how fertiliser runoff can kill fish (eutrophication).", "Nitrates cause algal growth that blocks light | Plants die and decomposers increase | Decomposers use up oxygen, so fish die"],
]);
EX("bio", "Photosynthesis practical", [
  [6, "Describe how to investigate the effect of light intensity on photosynthesis using pondweed.", "Place pondweed in a test tube of water with sodium hydrogencarbonate | Lamp at a measured distance, e.g. 10 cm | Use a heat shield/water bath for constant temperature | Count bubbles / measure gas volume over a set time | Repeat at different distances | Repeat and take means"],
  [2, "Explain why bubble counting may be inaccurate.", "Bubbles vary in size | Better to collect the gas in a gas syringe / measuring cylinder"],
]);
EX("bio", "Microscopy & magnification", [
  [2, "A cell is 25 mm in a drawing at ×500. Calculate the real size in µm.", "Real size = image ÷ magnification = 0.05 mm | 50 µm"],
  [4, "Describe how to prepare a slide of onion cells.", "Peel a thin layer of epidermis | Place on a slide with a drop of water | Add iodine stain | Lower a coverslip at an angle to avoid air bubbles"],
]);
EX("bio", "Quadrat fieldwork", [
  [4, "Describe how to investigate how plant distribution changes from the shade of a tree to open ground.", "Lay a tape measure (transect) from the tree outwards | Place quadrats at regular intervals | Count / estimate percentage cover at each point | Measure light intensity at each point with a light meter"],
  [2, "Give two ways to make the results of a transect more valid.", "Repeat the transect at different places | Measure other abiotic factors / do it at the same time of day"],
]);

/* ---------- CHEMISTRY ---------- */
EX("chem", "Atomic structure & isotopes", [
  [3, "Describe the structure of an atom.", "Nucleus contains protons and neutrons | Electrons in shells around the nucleus | Nucleus is tiny compared with the atom"],
  [2, "Define isotopes.", "Atoms of the same element with the same number of protons | but different numbers of neutrons"],
  [2, "Chlorine is 75% Cl-35 and 25% Cl-37. Calculate the relative atomic mass.", "(35×75 + 37×25) ÷ 100 | 35.5"],
  [3, "Describe how the model of the atom changed after the gold foil experiment.", "Most alpha particles passed straight through, so the atom is mostly empty space | Some deflected, so there's a positive nucleus | Plum pudding model replaced by the nuclear model"],
]);
EX("chem", "Periodic table", [
  [3, "Explain how Mendeleev arranged his periodic table.", "By atomic mass | Grouped elements with similar properties | Left gaps for undiscovered elements and predicted their properties"],
  [2, "Explain why elements in the same group have similar chemical properties.", "Same number of electrons in the outer shell | They react in similar ways"],
]);
EX("chem", "Ionic bonding", [
  [4, "Describe how sodium and chlorine form sodium chloride.", "Sodium loses one electron to form Na⁺ | Chlorine gains one electron to form Cl⁻ | Both get full outer shells | Strong electrostatic attraction between oppositely charged ions"],
  [3, "Explain why sodium chloride has a high melting point and conducts when molten.", "Giant ionic lattice with strong electrostatic forces | Lots of energy needed to overcome them | When molten, ions are free to move and carry charge"],
]);
EX("chem", "Covalent & metallic bonding", [
  [3, "Explain why diamond is very hard and has a high melting point.", "Giant covalent structure | Each carbon bonded to 4 others | Many strong covalent bonds need lots of energy to break"],
  [3, "Explain why graphite conducts electricity.", "Each carbon bonded to 3 others | One delocalised electron per carbon | Electrons move through the structure"],
  [3, "Explain why metals conduct electricity and are malleable.", "Sea of delocalised electrons that carry charge | Layers of positive ions | can slide over each other"],
  [2, "Explain why simple molecular substances have low boiling points.", "Weak intermolecular forces | Little energy needed to overcome them (the covalent bonds don't break)"],
]);
EX("chem", "Formulae, equations & moles", [
  [2, "Balance: Mg + O₂ → MgO", "2Mg + O₂ → 2MgO | Correct coefficients"],
  [3, "Calculate the mass of MgO made from 12 g of Mg. (Ar Mg = 24, O = 16)", "Moles Mg = 12 ÷ 24 = 0.5 | Moles MgO = 0.5 | Mass = 0.5 × 40 = 20 g"],
  [2, "Calculate the number of moles in 22 g of CO₂.", "Mr = 44 | 0.5 mol"],
  [3, "Explain why the mass seems to decrease when a metal carbonate is heated in an open container.", "Carbon dioxide gas is produced | It escapes into the air | Mass is still conserved overall"],
]);
EX("chem", "States of matter", [
  [3, "Describe the arrangement and movement of particles in a solid, liquid and gas.", "Solid: regular, close together, vibrate | Liquid: close, random, move past each other | Gas: far apart, random, move quickly"],
  [2, "Explain what happens to particles when a solid melts.", "Particles gain energy and vibrate more | Forces between them are overcome, so they move around"],
]);
EX("chem", "Separating mixtures & chromatography", [
  [3, "Describe how to obtain pure water from salty water.", "Simple distillation | Heat: water evaporates and the vapour rises | Condenser cools it back to liquid; collect it"],
  [2, "A spot moves 3 cm; the solvent front moves 6 cm. Calculate Rf.", "Rf = distance of spot ÷ distance of solvent | 0.5"],
  [3, "Describe how fractional distillation separates ethanol and water.", "Heat the mixture | Ethanol has a lower boiling point and evaporates first | Rises up the fractionating column and is condensed"],
]);
EX("chem", "Potable water", [
  [4, "Describe how fresh water is made potable in the UK.", "Choose a source (lake/river/groundwater) | Sedimentation | Filtration through sand beds | Sterilisation with chlorine / UV / ozone"],
  [3, "Explain why desalination isn't widely used in the UK.", "Needs lots of energy | Expensive | The UK has plenty of fresh water"],
]);
EX("chem", "Acids, alkalis & pH", [
  [2, "Write the ionic equation for neutralisation.", "H⁺ + OH⁻ → | H₂O"],
  [3, "Explain the difference between a strong and a weak acid.", "A strong acid fully ionises in water | A weak acid partially ionises | Strong acid has a lower pH at the same concentration"],
  [2, "What happens to the H⁺ concentration when pH decreases by 1?", "It increases | by a factor of 10"],
]);
EX("chem", "Making salts", [
  [6, "Describe how to make pure dry crystals of copper sulfate from copper oxide.", "Warm sulfuric acid | Add copper oxide until in excess (no more dissolves) | Filter to remove the excess | Heat the filtrate to evaporate some water | Leave to cool and crystallise | Pat dry with filter paper"],
  [2, "Name the salt formed from zinc and hydrochloric acid, and the other product.", "Zinc chloride | Hydrogen"],
  [3, "Describe a titration to find the volume of acid needed to neutralise 25 cm³ of alkali.", "Pipette 25 cm³ of alkali into a flask with indicator | Add acid from a burette, swirling, until it changes colour | Repeat until concordant results"],
]);
EX("chem", "Reactivity & displacement", [
  [3, "Explain what happens when zinc is placed in copper sulfate solution.", "Zinc is more reactive than copper | Zinc displaces copper | Brown copper forms; the blue colour fades (zinc sulfate forms)"],
  [3, "Describe how to order metals by reactivity using acid.", "Add equal-size pieces to the same acid at the same concentration | Observe bubbles / temperature rise | More bubbles means more reactive"],
]);
EX("chem", "Oxidation & reduction", [
  [2, "Define oxidation and reduction in terms of electrons.", "Oxidation is loss of electrons | Reduction is gain of electrons (OIL RIG)"],
  [2, "In Fe₂O₃ + 3CO → 2Fe + 3CO₂, which substance is reduced? Explain.", "Iron oxide | It loses oxygen"],
]);
EX("chem", "Electrolysis", [
  [4, "Explain the products of electrolysing sodium chloride solution.", "Cathode: hydrogen, because sodium is more reactive than hydrogen | Anode: chlorine, as halide ions are discharged | Sodium hydroxide remains in solution | Na⁺ and OH⁻ are left"],
  [2, "Write the half equation at the cathode for the electrolysis of molten lead bromide.", "Pb²⁺ + 2e⁻ → Pb | Balanced electrons"],
  [3, "Explain why ionic solids can't be electrolysed.", "Ions are fixed in a lattice | They can't move to the electrodes | Must be molten or dissolved"],
]);
EX("chem", "Extracting metals & recycling", [
  [3, "Explain why aluminium is extracted by electrolysis but iron by carbon.", "Aluminium is more reactive than carbon | Carbon can't reduce aluminium oxide | Iron is less reactive than carbon"],
  [3, "Give advantages of recycling metals.", "Saves finite ores | Uses less energy than extraction | Less waste to landfill / less mining damage"],
  [2, "Describe phytoextraction.", "Plants absorb metal compounds from the soil | Plants are burned; metal is extracted from the ash"],
]);
EX("chem", "Life-cycle assessment", [
  [4, "Describe the four stages of a life-cycle assessment.", "Extracting and processing raw materials | Manufacture and packaging | Use and operation | Disposal at the end of life"],
  [3, "Compare plastic and paper bags using an LCA.", "Paper from a renewable source but uses more energy / water to make | Plastic from crude oil; reusable more often | Paper biodegrades; plastic persists in landfill"],
]);
EX("chem", "Reversible reactions & equilibrium", [
  [2, "What is dynamic equilibrium?", "Forward and backward reactions happen at the same rate | Concentrations stay constant (closed system)"],
  [3, "N₂ + 3H₂ ⇌ 2NH₃ (exothermic). Explain the effect of increasing pressure on the yield.", "Equilibrium shifts towards fewer moles of gas | 4 moles → 2 moles, so to the right | Yield of ammonia increases"],
  [3, "Explain the effect of increasing temperature on the yield of ammonia.", "The forward reaction is exothermic | Equilibrium shifts in the endothermic direction (left) | Yield decreases"],
]);
EX("chem", "Groups 1, 7 & 0", [
  [4, "Explain why reactivity increases down group 1.", "Outer electron further from the nucleus | More shielding | Weaker attraction | so the electron is lost more easily"],
  [3, "Explain why chlorine displaces bromine from potassium bromide.", "Chlorine is more reactive | Smaller atom, so it gains an electron more easily | Cl₂ + 2KBr → 2KCl + Br₂"],
  [2, "Why are noble gases unreactive?", "Full outer shell | Don't need to gain or lose electrons"],
]);
EX("chem", "Rates of reaction", [
  [4, "Use collision theory to explain why increasing temperature increases the rate.", "Particles have more energy and move faster | Collide more often | More collisions have energy ≥ activation energy | More successful collisions per second"],
  [3, "Explain how a catalyst increases the rate.", "Provides an alternative pathway | with lower activation energy | Not used up"],
  [4, "Describe how to measure the rate of reaction between marble chips and acid.", "Measure the volume of CO₂ with a gas syringe | or measure mass loss on a balance | Take readings at regular time intervals | Plot a graph; the gradient is the rate"],
]);
EX("chem", "Energy changes", [
  [3, "Explain, in terms of bonds, why a reaction is exothermic.", "Energy is needed to break bonds | Energy is released when making bonds | More energy is released making bonds than needed to break them"],
  [3, "Draw/describe a reaction profile for an endothermic reaction.", "Products higher than reactants | Activation energy shown as the peak above reactants | Overall energy change positive"],
]);
EX("chem", "Crude oil & fuels", [
  [4, "Explain how crude oil is separated by fractional distillation.", "Heated and vapourised | Column is hotter at the bottom and cooler at the top | Fractions condense at different heights by boiling point | Long chains collect at the bottom"],
  [3, "Explain why cracking is needed.", "Long-chain alkanes are less useful | Demand for short chains such as petrol is greater | Cracking also produces alkenes for polymers"],
  [3, "Describe the problems caused by incomplete combustion.", "Produces carbon monoxide | which is toxic and binds to haemoglobin | Produces soot (carbon particles)"],
]);
EX("chem", "Atmosphere & climate change", [
  [4, "Describe how the early atmosphere changed to today's atmosphere.", "Volcanoes released CO₂ and water vapour | Water vapour condensed to form oceans | CO₂ dissolved in oceans / locked in sedimentary rocks | Photosynthesis by plants and algae produced oxygen"],
  [4, "Explain how greenhouse gases cause global warming.", "The sun's radiation passes through the atmosphere | Earth emits infrared radiation | Greenhouse gases (CO₂, methane) absorb and re-emit it | Increased levels trap more heat"],
]);
EX("chem", "Chromatography of inks", [
  [5, "Describe how to carry out paper chromatography of inks.", "Draw a pencil start line | Spot the inks on the line | Place in a solvent below the line | Lid on; let the solvent rise | Remove, mark the solvent front, calculate Rf"],
  [2, "Why is the start line drawn in pencil, not pen?", "Pencil is insoluble | Pen ink would separate and interfere with the results"],
]);
EX("chem", "Copper sulfate crystals", [
  [2, "Why is copper oxide added in excess?", "To make sure all the acid reacts | The excess can be filtered off, leaving only salt solution"],
  [2, "Suggest one safety precaution and why.", "Wear goggles | Acid is corrosive / hot liquid could spit"],
]);
EX("chem", "Investigating pH", [
  [4, "Describe how to investigate pH change as calcium hydroxide is added to dilute HCl.", "Measure 50 cm³ of HCl into a beaker | Add a measured mass of calcium hydroxide powder | Stir and measure pH with a pH meter / indicator | Repeat additions and record each pH"],
  [2, "Describe the shape of the pH graph obtained.", "Starts low (about 1) | Rises sharply near neutralisation, then levels off"],
]);
EX("chem", "Electrolysis practical", [
  [4, "Describe how to investigate the electrolysis of copper sulfate using copper electrodes.", "Weigh both electrodes | Connect to a d.c. supply and pass a current for a set time | Wash with propanone and dry | Reweigh: the cathode gains mass, the anode loses mass"],
  [2, "Why should the electrodes be dried before weighing?", "Water would add mass | Gives inaccurate results"],
]);
EX("chem", "Mr, % by mass, moles & concentration", [
  [2, "Calculate the % by mass of nitrogen in NH₄NO₃ (Mr 80).", "28 ÷ 80 × 100 | 35%"],
  [2, "4 g of NaOH is dissolved in 250 cm³. Calculate the concentration in g/dm³.", "250 cm³ = 0.25 dm³ | 16 g/dm³"],
  [3, "How many moles are in 25 cm³ of 0.2 mol/dm³ HCl?", "Convert to 0.025 dm³ | moles = concentration × volume | 0.005 mol"],
]);
