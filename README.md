# Maps
A visual environment for exploring objects, maps, and higher properties in the [category of finite sets](http://ncatlab.org/nlab/show/finite+set).

## Why

I think the simple domain of bubbles with dots in them ( finite sets ) and lines connecting the bubbles and dots ( functions between them ) is a wonderfully intuitive space for learning about mathematical thinking. This tool tries to be a relatively friendly environment to encounter mathematics in, to learn about logic, and to understand how to ask mathematical questions.

It also tries to maintain a level of mathematical rigor. No lies are told in this place. Our goal is the visual expression of all computable properties in the Category of Finite Sets. Beyond this, our goal is the development of useful interfaces to the space of abstract reasoning.

## Sets

This section explains what we are trying to model with this tool (properties of the Category of Finite Sets), and how we are trying to model them. It both the programmatic syntax and semantics that we're using at the core of this system.

All of the implementation described below can be imported by ```require```ing the source file ```finite-sets.js```. This module exposes the interface to the algorithms we use to compute various properties in Sets. We try to expose a simple public interface to all of our routines, in an effort to keep the system as "hot-swappable" as possible.

```javascript
var FiniteSets = require( '[path-to-file]/finite-sets' ); // a 3 element set.
```

### Sets by Explicit Enumeration

*Sets are finite, so we can list them out.*

We're representing the category of finite sets, so we need an appropriate representation of a set. I've chosen the most lightweight and iterable way to do this, a simple javascript array.

```javascript
var Set = ['a','b','c']; // a 3 element set.
```

This will be recognized as a set by the system, but you can also rely on the implementation to build a set.

```javascript
var Set = FiniteSets.set.explicit('a', 'b', 'c'); // == ['a','b','c']
```

if you rely on the implementation, you get a little bit of fact checking...


```javascript
var Set = FiniteSets.set.explicit('a', 'a'); // == ['a']
```

### Sets from Cardinality

*Every finite set, has some number of elements, N, and all sets with N elements are "the same".*

There are lot of great collections libraries out there, but I've opted for a representation that does no real book-keeping for us. This means the following things.

1. Sets contain unique elements. Therefore, the names of the elements in your array **must be unique**.

2. Elements in different sets are different, by virtue of being in different sets. Therefore, elements in different arrays must be named uniquely, as well.

Basically, all names of elements should be unique. For that reason, there's a convenience method that produces a uniquely enumerated set from the size of set you want.

```javascript
var Set = FiniteSets.set.natural( 3 ); // == [ 'UUID1','UUID2','UUID3' ]
```

These are system-internal names that are ideally invisible to the user. Later, a mapping from internal elements, to readable labels could be implemented.

### Maps

*Maps relate sets. Finite Maps have a domain Set, a codomain set, and a mapping of elements in the domain to the codomain.*

Maps are also represented as sparsely as possible.

```javascript
var Map = {domain: ["a","b"], mapping: [["a","x"],["b","x"]], codomain: ["x", "y"]};
```

This representation shows the set the map is definied on, ```["a","b"]```, the set the map is definied into, ```["x","y"]```, and the way the map acts on the domain: it takes ```"a"``` to ```"x"``` and ```"b"``` to ```"x"```. There are also convenience methods for creating maps.

```javascript
var Map = FiniteSets.map( ["a","b"], [["a","x"],["b","x"]], ["x","y"] );
```

which let you forget the labels, ```domain```, ```mapping```, and ```codomain```. ***Maps currently do not check themselves for well-formedness, in the way sets do.*

## Constructions

Let's look at some interesting constructions we can build with these tools. For now, refer to ```index.js``` to see some of the constructions in action.




