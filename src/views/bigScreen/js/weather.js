/**
 * 公共方法-获取天气图标
 * @param {str}  必传，天气（晴/多云）
 * @returns 天气图标
 */

let icon = {
    qing: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQWSURBVHgB7ZlfVtNOFMfvnQDHo7+H9Eer+ERcgbCDsALhQZAncQXiCigrQFcgPmnxIbgCugPrCoxvSovpg3CQkrne27QeKknpJBl96eehTU8nk/nOzJ37JwBTpkwZB4JFosB1qTcbEEFrfqP9AiyiwCaXt5ZYhM9Xq2AZu0L+InaFUNyFv4SxkO+NanDSqEXHB7WlGxvP9kICeKOJXsEEdA5qW9w3nby7tw2GzIApiC4QuA5BEAXecmUtzJz1ylpX/tuapNvo7YKnKd6DnBivCM721vgz5EtPX5wZz1wWWsUBf7mI0Jx/8u0lGGIsRGZZa/1MronIhZJgAV2ZIIydZ5ADK34kChY86IHPW+UhPyERS/iFZ63FU9+qbH4N0+/z3HFbdRylCZFBwOXZc9K0ygY+9iCQ7aP5EKiut/ehJEoREr1f8LWOX/OlB2a0lHbWslbIhMJ+JHp/d4dFHIG5CGGJjfxjp3G3sOcvtCKJCKpDCXA/K7XNThNykroi/f1+A+K8yhLRH4jCQHzJuDbjxoXXG7uuvpj9yJcu/3uoCD9UNo4PR9qI81K5t1Mmcgj8v95eGR2P5+qfP7ZQ4SMJQNPaCBk20tcnHnxLAwV/7mHtxDtQsghBBtp+W/VHnvXztM4K9wZRNG9B+JR277UQZRBWPJAOEXFVIS3yydIafWLSqQ0cB2WSmsPfHKcdOgiLMQu4hMv9+5vdMO0+Y2PvNOZXEVQAFlFzdyqmjtE81iLlg2Xi3qnxcWwuRMFDsAwSemCIsRA2utICxUzYLsGQHJ4d7QvJgfnWQgrBNhwpgyHGQnSOh5hCEu4bYr61kJpgGYdzFjAk048MQwPeS4t8ru8Oz/VBCBOBNZCLecfLv8eRhEPPlXI+VB5/bWbdlboi3w9qR/riNJLQgH9uxxdn/vA/8fxSGQFLcGI2UnGJla7LGCRV4ArLZ4m40+67JqRf5qQkw+tncpp2nbnbzattHO3U+ctCzQrD6uZo1sjbrJ5M3KDgodOrlqlbS5bzHM4hK64RTt5VtwcrVhoKYbmy3s60D4n/Zm7910oLXwolVp1GbZ87eAolICvPiVUdclI4Zy9DTFERQuGcvbrRlkxxF3KB4SDFrUNBSiliy0A4Z3lgcJp1Rbyau71cJE+/SukFOjkoYoh97nlJXY2UiboSFXB18rCswV8llxAZLCl9RISv8tRpU/ts1PZ4RX2cu7OSp9povLX6Hp8LDwTkgdKl5SZcefSlQsmOeCfP/eY2kjzIE0NVsZPTyK/DNjN8x7gtpSYwxDz6haTwwEWJiUqdMqhJKol9u6FEDGq4+SVSUcQ+JnpbJW25Xf8NFMdIMCF/loMmxfiNlVHBGR2ujcVgQt4TbfpWdyJmzltyKBBCCFOmTPmn/AJ7l8/QsR05pQAAAABJRU5ErkJggg==",
    dayu: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQ9SURBVHgB7ZlNTttAFMff2KWUFqmwSEDqJiwrFSmcoOEEwJIVvkF7A5ITkJ4AWFFoJegJCCcARFCXeInKoqmUACGxp/+XD/B34o98LPKTLNtjjz3/eTPvPY+JJkwYCIIGyMPDQw67z0KIrJRyrvVCISo4/oXD0szMjE4JMRAhEJDBbhdbrsete9gKSQhKXMjT09NWs9ksoufn+qyiY1uNKyZRIfV6fd00zWMKj04xxSiUEDycIGKHopGh9lCMTGJCwDa1GxSVXK1WW6eIJCkkRzFRFOULRSQRIR03m6H45LpuOiyRhPB8sL4Qx1lKiEajkaEI9OW1uNGPj49sdo3sPa9jK3WONUqA+/t7gtPgoHmB0/2pqanS/Py83qteTyEsAA/Oh4gLsYBF+J3WIh1bIZ1O7wXVCxSCIcQuUaMhw0JYkBV0ZD6VShX86vjOEQQ3dqcajYDp6WluuK0MQy1/d3e37VfH0yKdXOmGRghSHe5MVzkErsIyJWe5n0V8lQ8LTHKXVRhYxrNtnhaB5/g7rMkdBHswwzBc5RAJRzZfsZa5LAKTZsdBBINI71kOcTnXvR43jYUIxmtoMQgHrja6hKiqWqExAQ32LIelXG10CUEGqtOYgIntV95bSGcSlWjEsDW8JjpE6GHc7xmNGGdk79JZuHDhKQQpQpHaOc5IYGt4CWFrYCt61fHNtarVahaT6nTYrpjnBeap1/zgIb+K5PHCq55vrjU7O3uBnlmlIVqGLcFB0CmCLUEBIpjADysWww/AC/ZpgHDDOa/qfItYL/F3SQHlK0EimL6XgzqJJH+KcuR/TwnBc4ETRKsAHP/DsL7AEDtZWloam7g2YaxYPPidoSEQeTkoc3wzlz68Oua93z3pH9fbpmKc+93DIheOyqeLB1c5iskrigA34P6pdgpfgX31EkV55z3po+tdMqXGxw/1Gu+LzmdA5ClJrMqoLZ9TohiEtshzA56XhYRrdTB1VNbgUzXLW9aCngHvmwuybD+EFiJVY5fsa1tzH47KtgU6xSR7o6T93FQaWcczqNaIvu7beieFREqRcZYZhn2Zsz7d2BOWjECY9M32UlO4YoNqSJ1iEFqIkNLWqHaDX+nWssrGSmXm9bsV9P2GFLRyu/lpz3r9dnO5JK3PMWWByygGkX70LB6UNanSFjIiXTFUNOKjThHozgt9YxK948O9mXJMciutGHF4fRx0veXdEiJSQOzGEVT2/NWW+lneMpXmuSS57hXsuAPY/QpJO3Hdbpc4cSTL/t/ZUL4uDP7t3P4gM1Wx5bouZTeG4HdFNZF/K6GFoKc1ssQAKUTW4/oL0v5LzlB5ce3lq9NU4v+yYyIMLWn7wMHwsC9dmo5UQ9jPVUPF+ctyzpQQJ5QAkdzvwvfyV047pCHP/mwu553X2T2bilwjky7fvpktOt1re3g2NRYdN35MmDBg/gMXLRE1I2mJnAAAAABJRU5ErkJggg==",
    bingbao: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAPHSURBVHgB7ZlJUttAFIafDRTDJqYKqmAVecOwgpwgyg3ICbBPgHMC7BNgThByApwTYE6AWTFsrGzZ2Bvmwfl/R6ZcrZaQWy3sJP6quiS11HL//V6/fmqLjBkzJoqMpEyn08k9PDy4Ly8vOV5ns9k2zhuzs7Oe/A3c3t66KEcoHV25u7s7wbEglrBuEVoAnTzEqRuzSR2lmNRCVoVghB0cjlAcGQwP5UsSMVmxSCaToSUcGRzHb2uMNSH0d7jVphjCttfX12UxxJprQUhTzKzxCqzSnp6ezvMoA2LFIoxQklAE8QOFkVVtuZYrloCYLTFgMu6DvYXt+fmZEzOH6zaOXNjqYsEaPbBYblxdXRXwbm9xcbEet92bc8QPqbscKQrQPOJRZMi9gXl8fBS41+u7UepTU1OV+fl5L6pdpBBYYPvp6alqq5NxwKDIzc0NLdNfzbSmsrS0VA1rFyoEo7KDl4Y2TBOKQSjuHvvBgJbhbhVdG60Q352aMkQwF7uWUUHSWVhYWPgRqA95z3cZMhMTE92iAhertlqtgKsHhGBeMI67MgJMTmqDKqNnSa0MCIFJjeJ4GoQI4Vz5rNZlNQ9tyIiAvoTdCqz+ASFcE2REiBDy9hwxSdjSQllLIslqGv+SESFCSEOt0FmkJiMCsoqwWwEhYQti4m+LpNAaXN11ILLml5eXvf66sAWxIkMGa4W2HgL3VRFEKwSp+QGi174MCYpgFqyCPnnwlrKuTeiH1dzcXGkYYiji/v5ed6uO3OtTPp/XRtU43yMFHHYl5TnDOcHvECaLCm+m8CT25gMmHlOXLWSfH8USTNMpgG6kuhLqT/FbDfxuLcwK/ySpb2JHcXZ25mLUt5kWofxcX18/EEMSCWFHsIDu4DSHDtVWVlZiBwe/7R4EfMV3Rw6uxHl4vLa29r5fpeiIc35+ftJsNrsJHM5Ll5eXe3Hb4/lDvkOpOxFDjPe1MJolWKHYm4gcSYyqM0D7NlzJU6qNJ3WiDTqESvWHY38CwKVOLy4udnvXON/mXpYYEnuDTtORGizCjhR57fu817vvX/O+i9JgMrq6uvqa+tCCeKZMF8Nld8MP+75FMSTRZMcobqEDnOwUdjwzM1Olq6GD3Cnkpl4R7lPnXODEpjtBjHFn3x2MclOdyAwKqG/RUpICVv/oIT0B6kSmpbhWSEqpjnUhcC8GAO2kh2t94L+6kgLWhfjhuNEfkYhvqU3+NS0pYBy1ouAkx+EIYhyGWSaaEMDd/G+IVp6kQKq5FqOX/Pmjk6H14L/KYseMGTF+Az53Av1kI5DKAAAAAElFTkSuQmCC",
    daxue: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAARWSURBVHgB7VpJUttAFP02YayiYhZQxQp5w7DCPgHiBHFOYHMCwgmMTwCcwOYEgROgnACyYtggtrCIKObReU9uV4jTElZbilj4VXU13XJL/f77/X+rhUgffSSCjCSIu7s7q9lsljKZzCKaFmoPtYu+3dHRUUdiRCJESABVHcUO+ZmLUgOhhsSArMSMx8fHMiy+L+EkCAulfnt7uyExIFZFHh4eSq+vr98lOhpQZkV6QGxElDvtScvSkQEV18bGxjbFEHG6VlUMSRDZbLYKMjkxRGxEGJ2kB5AEVK2IIT5JDMAEbFTG1mxjYGBgUQwRmQiiUuHl5cWf9MjIyIHKDZbEANy3cH5+XhgcHHQnJia8KGO7WuzX19cFWGtVJbe/LI/2ASKVi7on1yJwH7m5uWk3HZTtqampRjdj3yVyf39PAsbRJArwHEFe8Qm9gQuFlqGQGzY2dLEjL1T/FwkCqgpCsF+/gfX09LRPlwsdG3RBRZC6pACsFV+ZDnhQphikjFYRldyqkhKwHv3SgRyUCTRskGvZElMkMgWsr+u2Ly4ubN2FICJlSRkaRXwgENi6/iAilqQMbFm0/Qg+2kUf+zY+aYDgZ22/fFB05JK3/Ze6fi0RZmtJGUFEguaWDbjJD0kZCLXafsytoevXEkFG549dSQlU4/n5WXepMT097eouaImonWdPr56maO+3NP0uMn4taFzgYlfHNYEDkwBJwBv8ugMe1sbXIDWI0KgFMuvSUsaVhEF3ohKateFAiSK286EBqKv3EbX3smGpVVimIDGBlucGkZPvWBNUwEG9NTk56XRzL6NTFEXMx9XVVW58fDzS21wbnvfvMLz/ePl8PvL9jI+DDg8PLWltZWwUZ2FhwZEUYZTZj4+P/S0+5N9AKWOD56GvdHp6GvkAguMkBkRW5OjoiIdwueHh4WX4tgUfL0GNddXvwe+33lNHqekbQtU7KD9nZ2eNdxSRFKHFsWnjw3IIk3WepkCNz0ohXw2qE3aPk5MTBosKC08XeQozNze3jai1gWvG58CRiHAR4oWnNj8/n1eTqGMCFZQz9BWh0gqPcsLuAfKMSIsoS2jaJAKF1vF3DtcuxRCRXQsPbcDqvzB5C80znhBiMjNUin2oa2Eu0l5HNIpyRxtjihxDl4NbumKAyIsdD21iwiWuBXXC4kKNZUWMVg11LYRXuuUeSWB8jYXrDO19GOSbGCIykaGhIbqUH25BqsyopRbvGdprOH18NwfwixUqFhdjZhgspLV7cMUQveQRW/4cUrhqMl2B7kVl2lFLEXNM3apncEKKkBbtMBuGsPFRkMg3xHbWh8UZlndh8Z2krR37OzvzBD/a8G8QYFjeZBvkKpIgEjl8YF6RVo6YYY5gu/MUP24kdYriqu8mXND+bgDqGO2Qu0UiRDDxJUyck9+FazE3fEFfokSSWuw291xwqToTp7TCsyMJIrF/4WBoxmc6GwnUMXlR6qOPD4Lf/582ohla+OsAAAAASUVORK5CYII=",
    zhongxue: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQMSURBVHgB7VlLVuJAFH3gfyYDddiViZ9R4wqMK6BdgbgCcAU0K5BeQeMKpFcgrqDpkZ8JceZx0vY5/n/0vQjnKKlATBUJA+45OZU8ElK33rdeRMYYYyhIyRBxd3fnYthIpVLZVqs1335hKnX1+vp6hLE2NzfniSUMhcj19XV2YmJiD6fugFurOMo2CFkncn9/X8DqVz7xiAfSW9PT0w0xgFUiEUi8TQLmlk6nN03IWCMCf1AYmhId3uzs7DpJSQSkxRKgiT0xg7q9vS1KRFjRiAVttEFtQCsZiQArGoE2vokFMER3QvanYYUIHHVDLAFkshIBk2Fu6qxUHqr/+i65eThv4PxXN9nZwNPTU+Hy8jKHU/730dLSUi3McwN9BARK+MMiJm1tsv0AIgzj70UejvLi4mK133OBRLjKDw8Ph1FVbQK8Vx4fHz/IsJCVhYWF3aBnAolgVX4nQaKLm5sbQU3WK65CMzu6+7XOjhUpJUmCQBjWifMXFxfaXOPTiK2cYANIkPLy8tIrvpqamnIymcyHCkCnEVdGBJOT2qA6D//xacVHBE6VkxEB8pNWjjn68pbvTjiYkhFBEBFA+e7tFcSVL2zDRwTRKlIZPQxowm8XvjnqdHckI4Ln52etHATPe2U60wpV28SBICLwHd8ctZkduYR5REmC0NRcbcD0PRSSTq88KCzsSIKgb7De0gHaCF+ioD1Tx1CWBIAVp0W0R81vZRSOdd1zfct4qLZoYS8eGtQEyxINiSvIdvrtTfruEFG4sbXj4AX7MkRw4jQlDQkSKKMSdgZtsEI3H7g/gYZYESuxEAiYr9hsoEPTsTVooGQ3atpFxvHxsWo2m4lUBtYadGdnZwWYoIOVbq/i2tpaVWKEMRFowUVInIeZeCByKG92vQnZ9srKSmyRz6gddHJyUuSEcZpbXl5m1+MHowu04bHXhd8PTk9PrfS8BiFUOygIHTMiEQXNtGs0ageT51ZZ4ZJaisVhjRt0mPDW6upqu80J82I3fo8fcigDqTI+GcTi/EYaARQbdtAATYk7Sw8HPxFsQ0YCG2yyYRy6VkyJ1HEcMMfMzMyssxKgjIUdCDYx1iAPdHiGasdxrOx/TE3LxbGPSdc5IWjiCzVEZ4e8xnYqGgWu7kFobBvZ/CcDhliAjfCrONKcMPE8TpmxK9z8gFBdc7+LwYXv1HAPtbmJ6zyvGfkkIkxNSzqrz4TIZvY/RjKaVlfeCwYEDAr9qirI0wzpZ6VOBEz+01sY0CdQVymuPEyKBWkOJHbx7bDelUtEWPv0Fgb0I6x8gYmSRSOOc5hXlr4CDRm1aGMlQmDyfzqf2CoY/8IEv3d+UmKAWE2L6JoXNFHCpWJZA0dvmJhV4oirDhtjDAP8B3OMMPMG2BMcAAAAAElFTkSuQmCC",
    xiaoxue: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOOSURBVHgB7ZlLTuNAEIbLIbxWEyQeYoWzAbEaH8HcIHMCMicYOEHICRAnIJyAHMGcYJIVgk3MElgkG96v+f/gSIzdDiEuJxHyJ0V2yu6kf1dVd3VbJCMjox+WpMjb21vh/v7ewdGxLKsQ2Dr5fN6bmZlpiCKpCAkE/MFxpyfAgI9PdX5+viYKqAu5u7tzIeC4j4Awtbm5uV3c35EEqAp5eHgovb6+HssXgYjG7OzsVhIxOVECnrBfXl4OZQiYQ2hfkQSoCQGVL4RTBLTdYVjKkKiEFr2BQ0uS4yH5t2QIVDzC0Ul04EAxlFdVhCAsfooSt7e3rgxBftAbg2HVyeVya8FTu5D3UPBwtEUJDBjbl5eX/B8PE2djYWFhoJHs0xwJEpAjihtziy+KQvB/8vz83D3ncIyHVp+enq5CkN+vnfXJj3I4LcsIwTzE8GLefTT7+L67srJSj2sXK2QcInrEiBGEW3lxcfHI1MaY7JihGUplGRPosCCcInYIrF1dXTmmNhGPKM4JiaA3bm5uIl4B3vLycmSuMXnElQkAiS5TU1OmS+719bUbNpqEbMuEECOEQ3QpbIsI4VwhEwJzJQY7cm/YkKTwGxUQ+CNiCxu4FJUJwZDosZg8orqWTgJywWjHMNwM20xBeCITQq9UCcPNi7AtMo+02+0C1tBtGTNPT0+CDYyIHeHmo1Qphu0RjwTVZlXGCHMD1YXxGkLf2LfYWgu1zl80GstQ/LEC/ggEVuGNPVOb2IEaT4RlgCcjhJ6IE4EE340TQQZZj5TlfT1iS4owJxhOptqK4bS0tOT1az/w5gMKuBJ+0MXpmsakyfmKCycOsUxqlu7/dcyymvBMfXV11ZeMjG/M+fn5voyAVF4roPPd+QcJ3N0LRuJy06CJdyJesVhMpSjV3Pvtcnp6akNABWtu7nwcwOTgu7WxsVHH8HrYarUK/IgyqkKCDu7h4/BN1ebmZg3nHo57gZccisE1dSED7zQOCsKIix4fxwq9QxuOZXiFS2hfUiLVd4hnZ2eHCK8yTj28yPmVVn4QVSEMHzz5fXjD79kghHvGJ1iesvZg3vDl6AHCzRNFVHNkfX29AREeOlrCp4kE/w2zj04ztI6Cl6MdrHfUV6HqyY4OX3C45eZzkCM2j4EHGrh+kkaypzaPoBhkUch5xJb3kKJ3bO2Q6pFasvfmisfHx314oYpw6qSZ7BkZGf35B4UCz3qcRJg5AAAAAElFTkSuQmCC",
    yujiaxue: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAARuSURBVHgB7VrLTttAFL12SACxCRKPoC7qbHhUrQpf0PAFbTetuiJ8AfAFwBcAX0BYIeiC9AswX0AQtDw2cReVULoIm/BIiN1zg1GDPQ52MiZpxZGGMeOZ8Zy5j7lzgegZzwgFCoUMy7Li5XI5ZZpmnH9XVfUCz7ne3l6D/gVcXV2lUHZRLFG5vr7eR50mSZAuEZYAFriuKMoHn0N0lNlWJSSVCJO4ubnZRT1JwWCgTLdCRiWJYEk0QYKhQYI71AKkEWF9D6BOLvAGlEqlJWoS0lQLRPKoNGoB2IiL7u7uJNcUEFIkwh6KWiTBYBuDN2tGNeUQadIuvOZqSj27/Ha83y1eNEQfR32Bmg82nSRI4x44LN8WCgW2N2NwcFD3O+5RG7EJzKGeZwKCLgb38XgXGJVKhfC9u8XBVjB3NhqNLvf39xuNxjUkgjPhQ7VaXZe1SD/Awuny8pIlU9/MYc1yIpFY9RrnSQTx0QxIZKgNYDJwxbW6HtjQJajbsmiMkAi8kIYqT20ENrEmGScQdKYHBgY2XO0e86xTmxGJRGrFCajYarFYdKm6i4gtjRR1ALq6hE6VrwXzzkaRRNLUIfAgwrbyztmmCjq9pQ4B7MHrlesAdvXkM4E6H4/bSDMBW1hwut9GcBGBV/hJHQJ2wR7IORtEEslSh+D29tbrlYuI8EDEQVR8yrBEBA5R+EAUqRcklRwZGTHq24RuASQWqM3AWeFlIxknCYaQCELzDHZkg9oEJsFRsBMgZiAGE26yp6Pu6+tLY+AaPTGYBKJu0SsdmzudTCaFXvXR+4idRFskiZcnEdgmmIDAwPlOsjY8PLzUaLzv5AMTwsdSOG1fSrxIGexiWY0EqmSg7EGVsl5S+C8RahI7n8/HsdMaJKjFYjE9zJ0NjcjZ2dkk1IYTFe/pzr42+P49MTFhUAiQTsSWwgxnW8bGxmZPTk5WYVfW6Ojowunp6TrsbA/ddNmEmiKS2DzWTNWaLHx+JQxneMEgksbjAmoOJzQUA9LZRZ0dHx//SJIROEE3vP1jzlRv9+EwV0TvWSJY/AGkMGV7tzkueMUebwr13vHxsUaSEYjI0Nfvi5ZlIiVTc71aYvMw1XByqBTZ5w+7bQoRvokwCTKtpfo2M6LMOPuxZ2JJwBYgNTrAM6vXGueluI1voGEYvH+JmDWdfwjLnaRg1eLLGUoGxp6FJN4hG3K/+Cwbu5dqvdg+ajqH7NvYh7YOi7ZKPUDh82vhHHXul6XG49j95kBIF/Uf3DpawUTzqmlNn395I+zTCL6T2Nj+byDyUJUUynj1hrvNQToGXHEOhOI9PT050YGo7eTjV5XSjmVL14ooHNfpFBC+iZRj1flYmZ/UGhlFIb032tfw3mIvPNeoz2WltFKvoiA0yeSMj8GigMDnCH+E66Af8sLQ1pHr9hRVaOrXp9c5CoAAqnUHWQTqwAt+YOTVaqQ9f3prBZZCs/j5d+GmtXz+Jbh7Dv1fOPyAQx7kTLRqRLn4HVClnvGMkPEHgmlQFwiWsdkAAAAASUVORK5CYII=",
    duoyun: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAPgSURBVHgB7Zg7TxtBEMdn9zCCQGELHLCEonORNjIlVUyTlIEicigimU8AdOkgfSRIQxeRVBAa4BPgFJEipYirSCkSTspDBEOwSGz8ut3MAEb2+XF79h1u7idZvl3NrvZ/szOzewA+Pj4+PoqcbI0unmyHN8AFOPQQyXgMJMTBBXoqxE36wCNOd4JBUQqcguRLI09+rzWzEUyucRNSLefYHNcFNz9JYPOjiaNdaAMDD/mzHd6XEmJcaJOhuUMDHHLyNnxAS+SCT9uN93RrMVObxzdlVKCig0PIozg2y5mcVXkJnnqkGac7ehAq+QUpIIbN2OUqpIGeS3Ou7YUeH6agA25MCAkQ5dwqZqlkOzvGIEWedLoVb0TIVdDu46OuOgb3fDKUyLxRtfdcSCciqgghp8NzxykVW0+EnJ+fxxljj6SUQfNoPy7/ftPF2Wcwjz+APP/uZCqD9w9NhmaNLDUutmfxX5JxnFvwvdq07modKRaLM0KIVXzUUcRFn3Z7GoB+V5S/voLKFwyVypnKlLoo5Rfxf4UaophbwSBawDhLS0wQtYaueaRQKKzi4hdVbGX+BxTeJ1S9kx1JZEL0QNu0AAWIzGUNq5ErQtATy+iJFSdjnIjBghr1vCBiPCSdiiDYrQnon3yhZGtqZtzOxo3Kvgwdoo1OAR+ZAjfoSghlJ+ggrdbSN/7A3kiyrJ1JV0IwuGPQJVrkob2N4Gk7G6X0S2+eFo21IUhtznka4yKNfTp0CcWKnHiKae8X5qePwBrSMktXA52yFsWLFhjardYWJSEUyHAZAzqKuO5HEdVHW5erIO4+u35mh7vADtaBFX5etKWQL6/tuEgyCcuilNs42Rqru+ewNiLoLp2EG6BcLlMdquvjxjoJMkYSR9Ha/szmKJ0aZrAwpmovW02FOCluboG1CEqlUl0fKxyuhe/cW1IZ3yDkaju58mXDCXSkyeVyUD3aVMG3Px0Oh1N245tlrY7rQjdQDAYCgYZ+FKa0njohbtSFbmgmBIlnMpk42GD1SBx6SG1mrMU0Tdt6ZRWiQw9pJaRav9pRJwT3oyt1oRdYPWJAD6lUKk370SMG2MAtA3ahh7QSgjGSAhvqhAwODhr4ZzvIC6h+tBDyOhKJGHbjG+oIqleqpG5Dld1aDJEsrue5yvgGIcPDw2ncYjcqhkTQecsKCptX8QbR9D4yMDBAp8p58Dj4yQN0WLSesbDfwL/JsbEx5Zht+/EBK71O93G8f9wHF2sMCSAPkADLdkph+10+n1+LRqOOSoHyVxT62IaHOl3TNNvi1AoK5urPMncW5zacLt7Hx8fHx8ct/gPd6NF7V8zd8wAAAABJRU5ErkJggg==",
    wumai: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOaSURBVHgB7ZpJctpAFIYfNp52uMp2lVcRGw+rwA3gBCEnAE6Q5ASBE9g5QeAEsU9gcgKTFcMG7WDJhnnK/5yGCKnFoG4EVearUkmo1XL//d7rft0y0Z49GyFAPjCZTELdbjfE16enp81AINAkzWxMiGj8F1ymcBi2YhNHAUf27OzMJA1sRAgLGI/HGfR8aIXHMxCTJUW0C+n1et9ZxDp1ILh4cnISV3G5A9KIFxEM3DCCuj9JAW0W6XQ6Bk41UiMNN8uRB3RaRKlHGbjWA3lEixBhjRgpwiMd3hUjD2gRgriIkCYgJkEeWEsI91i/349wr/F59pKDA21CwId6vW7QmqwU7Gh4Cqckyd2nIM4x0sBwOOS/Z313/urqKres3kIhwvc5iGPkE7A6tVqtt7MF8+joKH5+fm661XMVIkS8kDO92DiIOWq323Yx7MKpi4uLvKyOVIjIk15pCyKm2FzMShSuVrTflAY7z9C0RRFMMBikw8NDWdEv2U2HEHYpWOQr7QAsRoLRaDQc7ZNZJEY7gosQjpVPjnv2G5zA0Y6ABrsVOdroeHLFNcS2CdknTa1pvJ/wktn6W+Za2tfTXuH5xIUmJsfFQuBaT7QjjEYjt6Ll8wgmwuKuWAXzmVuRY3Z3CGGTYbRQ3gxQZTAYOFIUBvdMWRIpDXYE0iP9z2p9h2PDxRpNlMVlBa6jFlzsM9QXyWfcEkbA7h6/vr42ZfVchbCLoVfieOEP8gks1txEFBD40mRxyqoLK0NsuH3EoXXmZwtwPEhiwkTZMxLHp8vLywLteW+USiWDPMD1yuVyDccEh/KyQSnX4oYgZmqVSmXtzTmx82KIn0lSxLOQarU6awiCNGUvr9VqIfGMlOPj4wL9+7zA9Z9pm8Air8I1HiVlU7eZ7QezOLsrenVNOxv70MMiptfo8fD9/b2Je7wrQ3d3d3HSTJA2BBqfRfwkcc6zCHEvTVve1FgJjgm4Soq2gFaLII1IsBVwmVv0HMcFf0LgL1QI+m/hcFh52aB1qQsXyuATWnTZcxDAw3WCRzskp5523+0oC+HJzOpO1t4Vo1RKMjL9sVybpAGlUQsN5ESSdyXfAhkWyVnLeaKczjGYAKM3NzdFS1kCSWETdQqkAVWLGIsKrXtkuJ579vb2lvcGTNKEarBnROptYlXp2LSAFdLo9Qc88xtzx1w5rBmDNV8w0s1Zyiu+/AuHDI4fBDoni7npPLNnzw7yF7t12sl9VBIMAAAAAElFTkSuQmCC",
    xiaoyu: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMBSURBVHgB7ZlNbtpQEMfn8SWgi8IiIuzMsquGExROULLsKtwg7QmAG6QnCF1FiiqVG5ScIEiN2mW87A5nwTf49T+USo39DNg8A2r9kyybwZbf3zNvZp5NFBER8V8gaA+MRiPjz3E6nbaEEBZpJjQhGHwFA35r23Yd+9yzmwrRk1J+zGQybdKEdiEYYG4ymTSwf7/F6Sa2lg5BWoWsQugrNoP80YSYFu2AbiGP5F/EEnjwQzabvaKAxEgTHE4UUMRyILEYh2OOAqJFCIcUJnWTdoBFDIfDbeaVEl0eqZAG4vH4JQVEixBOs6QB9sp0Oj2jACT8nLzKSrzx07NSqVSPjxFWBsSQDubz+Zt+v2/m83lfRXPj3fkpjcdjdnmdHJMZ/3GV7mBfcxa9oOBhsRg+NLF1k8lkC6LMTdetFYJMVFssFte6BrkNs9mM8OCc5vYmQZ5COJ3umomC4iHGhJiqlxilEO6T6HeFPhhIxYRocJpZTFk1f7yy1jUdGHTJKrOB+dNQ/eESAm/UaYcKrQtUes6MLjs3o8hqrjnrEqKrJuggkVBXB8zfutPmEgLFgQpSGKypTRWnQTVHDDoSvIQg7F66bPSPoBJi0pGgSL9LUN+enDaVkDs6EryEILQ6LpvivDYdAXjqnkJg7zptLiFYO/NJXTowaOeVdmTVVrFYNJ12rxbFwAX3+2wW/wZ1QikEY+oVCoWy6hpl1oJXTLi2ym067RkW4CUC/VfV67q1bfwOr3d8g4EuPcGdrwOLX+bBE81112+1rBsMBrxwusBhRWe48eB5QvNCijf+vYIjgd9G3sELV6VSae+RERER4RPjy+NealGo3e/J7cPZcDq4P735VqGQCU3IyeeHCyHlsgbJuGhQyITyxapw+/1SSvvZJ4Js6kXePA+vHmj3yOnND8MpghlNBnUKEe1CpFjUlPYYvaYQ0S7EjpEyfIRNTxQi2oXMkrOOcC2X8bJbxgN/VtsG7UKs87Il7DjabfsTfuKzg+xIIao/370yKSIi4mD8AqIyWyrArflEAAAAAElFTkSuQmCC",
    zhongyu: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOJSURBVHgB7ZlBUhpBFIbfDFHQ1biQ4G7YxypyA7yBrpKs9AaYEwAniJ5AXFnRBeYE4QZS0SRLZwnZQBaggEznfwZSMPSAM9M0pIqvimKqa3p6/n793uvXQ7RixVwwSANCCOvx8dHi60Qi0TQMo0mKmZuQh4cHG3+H+B3hZ48NahhViDvFZWVjY8MhBcxFCGY/57puAS9szbjVwa8IMSWKiHIhsMQZ/bVCEAoQU6QImKSQTqeTp+AimEK32z2kCCizyMAn7ikkHADi8Xg6bCBQZhG8wCeKAEe2drt9TCFRYpFGo2EhrDYoOg58JU0hUGIRiMiQGuzBEg3MqyA3Y5AslkBmGFZN06yur69XEG5tUgSela/X618whpNMJqsv7feipQUBeQg4npIXHPIkvbDAT6jf748+twhBpVn9pgphM+Ply2wF0gQS6bMYjDnaXF1bWzvY2tpy/Pr5Chms1a+kaKaD0Ov1eIl5mx2I2fMTM83ZObnZtADwwhSLxbzNNgSW/fpIhbRarX0Kl6GVgeQoa87UajVprpEKwWxE2i6ogC0C/5xoR6TMye6X+gj8Q9ASgPegp6eniXZEtfTOzo4z2mZKOtu0JMgswsBaWW+b0t2vavyEyFhqIZxTZHDW97ZNCOHSE8lIeU0dhpEMPwb8xvG2+VnknBYMO7knuw+peB2dkQqB6a5pwcii1QDpJEuFYHlVBqccCwFl7/M2RULJbwPp6+ybm5ucQSukGXZwFuIFE1vFjuOjX7+Z8Q070RMstRxpgAXgAGOiHeJOU6nU1DL4RYEaA2SwZvMQtE+KYYdmf+Cl5IlSTQg4R/K73t7ersx6TuCanatEUgRv1WVOzeFVFplW/E8oO6Czy/dWq9vKGyR+/3q3WyDNBDpF8SN18dNud1tlzApq++eTwgJpJvKmkUW4Zp9r++EBhZW6uM2SZiILgQiuo+2xtpihvcKMJMQq3/A51+RRkaAsaSaSkObBW/jD5JYfvqK9DIi8tAxhTHygMVyauuFMXd1mk5d3Z6QQJeE3dXF3JGJ0yAWZCRG1D7sVv3tfX/7ICeGe8LXpir1p9wZBy1fdIcmr73lyReHf4IJO6+/fhP4mMoq2mj35+dv+qAhGGKQsumk8fDBkB+HIOTc2KUCbEAQFaSRLJCwlEU6bkE68V8Lf+IcbVxSdg7QSIVqdnWFfMYRpGyhdVUWsFSvmyB9Ca2oqvlaMqgAAAABJRU5ErkJggg==",
    dayu: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAPQSURBVHgB7ZlNTttAFMefbVEIXTRIkIC6cfZUTU9Q5wSFTT9WpCegPQFwAtITNKwQUAk4AeEEpG1Kl3jZNguoIAESbPf/ogQFexz8MUmolJ8UjfP8Nf+Z9+bNjIlGjOgLCvWRy8tLQ1GUVzjUHcdJtl6oKGc43p+YmNjjY5JEX4SwAFR2HRXN9rjMxK+YSCTWSALShVxfX6/Ytr0a9HqILY+Pj+fi9o5UIWFF3FZCghhpQuBOOooTighcsTA5OfmRIiJTyAEKg+KRQcyYFAGVJNBoNDioDYoJ3DJPEZEi5ObmxiAJtIfqSIQWwvmgHQ/dFciSBOI8J1CMdBIbRCzgr9714jJs5bbNIAmcn5+3kibcrIRyP5VKFYPc11MItz4PqSg/0ICo1WocK90mc2xsLDc1NWX2us9XSFvEAUopbhMUvK8lhstuVFXNT09Pb/jd5xsjV1dX64MWwcCdCPnEY0cvFavVquF7n8iImMij+ExDBA1JzWbTbT6Dm2XgZp4ZgLBH0BPLNGRQYZE5iZwljFePEB5aZQ2ncdA0reVmbmBbEl3vEQJfHLqIDiIhQD89PU26jargZp0eCD5COH4CCZG2aouLewjuhSjYTXoguBLjLXNzc6bb5hGCbuNpx9B7BRNRv1MlkdEjhMdo3hygIYNh1u+UMLv7JUTe9ThCvCRpCHAi5IQooIRJZE50QpgQeZWGuY2U3Y2wcFxgjuexo2FNy7Le+93nO9fCvlMBxUDFsIh6ve4ZrXipgHM5UZB3uHc90l5E8bzLoD7BFeeYEMQFx+undDq9et8zAm8+XFxcZOFuvMB6ThLhWIDL3BlqcfwXU5Q9vLOcyWQeTF4bMSIsqa3jBYqJvnsiJVdF2tfil6e3K9hZtHdnN78bFJGZ7Uq23qgdxXlGh9BCZjd/6vxyjJgG/3cUJVKvpLePlxWHjoi/nWjKCsUktBBbtXiPV+/8dxRaopCkdn5gi8ku3D4DjRLXxUIJmd1puYDuMiefwkUoINyjZDurbnutWYsVb6GEWI540WVZTuDWtDTLENlVm2ItsUMJqb6e5+3RcrcNUwPz17tnpYCPIM1yTJ9TJsUgdIyotraISNnAcroEF1lLPHr8QnTdzJfKEkalvNveFn1nTcGNoTjaHsWgLx9DZ7Yq63gw7z+V/7yZFwqd3azkbY1eKjZ9TYw/LpqL8eZU0oV0iWih2k4ujOtFRcqHng6prW8L3SKYqHkmLFKFOIrqGb0clZ7QAJAqpDnWRMDe3YFRLTqkASA/RpAc0Tr8SeJMcZTD32/nCzRixP/LP6Z7qN2HopcTAAAAAElFTkSuQmCC",
    leiyu: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAASDSURBVHgB7ZlBb9NIFMff2E2bttJuIpo0lVba7HElVhs+wbrfoD2FnOh+AsgnaPMJCp+AcEKhh/bMBXNB4kSREAhxwAgOaQPUgiZ1SezhvTSBxB47jjNOi9Sf1Dp9nknn7zfz3ssLwCWXxAKDGOGcpyzLKuC1wBhL9WzmzMyMPjs7uw8SiUVIT8BNvN7qCxBg4E9lfn6+ChKQLuT4+LigquouvsyHnFJNJpNlFGzCBEgVQiIURXkU4AXxIhjbn5ubW51EjAKSODk5yZMnxhVB0Bk6PT29CxMgTQiyCeG3kwcUs4YPQ4OISNla5A28vIXJ0fHwr0IEpHiEnibIQaOIBxGQIgQP+H8giVarpUEEZsIOpP3bS2z/9kzvUMA+JjYdc0akpyjCtu0bBwcHBXzZfe90Oh0qko08Iz0B2yigILpPmTpKpAr4f9DpdAZN1UQiUUFBRtC8QCH4pLcpO8MUcRyHthc9oEGzifZKLpe77TfPV8h5iOjjI4bsZT8xQiG9OslX/TRot9u0Do8dt/FqJpPR3XZP1KKccF6eGAQrZFq0x45r2xSNF4VfDSbI0LIgESRGgNZoNDS3USTkBlwQsHYT2jFEexKwSEgeLgiirUWIErDMonGaePLWryrEcBs8QuhDDlwQXBl+EMNt8AjBpPMYJOO03kMUAoR41ugRgp/UqlQ/gSR46wM49YcwLpQQ3Zm9+36cG9lstuq2e4RQtYlRoQIS4O0vYD0pwriQAHygwnu49YVrEx527Grcxi12Dyak/aKCHsFtlfhtrHkkwscbFZE3CN+otbi4uIET70BE2q+3ofN+p/uazf8Rag4tnsp42laCe5Xl5eUtv7mB4XdhYYFqrv9BECUCF4TngoT0YYnfR86hxTebTdEB16lQDBJBjPyE2OsEVnsdDvr5M2g8//ombz3d0IaMDPbwtzCAYLnRrXKpdB+awthzFLW3srJiQAikdxo/15Z2ObChWuhKsRFrj5mQmtmPdrKbbhHg4wnZSBNytJPTHIdvCW5NRUjoLspI8Izys8DwA6acdR8/17JDzTscd+9K8XALJBJp7y4/eHmT2fbzeukfPWjcp1rmGV5c3RdmKLML19LrhlRPjeWR/O7bVOvb8V3OnTVQmY4mfdQU19+m4iirskUQoc9I7v6rfOtbE5/w2WHG3KWRsBHThu47mNTSpboBMRBaCFdtavvnB20np80Nv/FH93NDY1H4ncz1j7F1ZkIJyTx4USAPCG5pvpNUe8AbzFi63gjszJB3s7WXkZvhoYSotmr6zPavPZjaF9I9FxDAz23r7IbYrj5LCUG99LeBfQDdbWc2+FbINrfzdOUOlIPOBYlwlA5Ft+54DCaRemqhzwizVcwRVNpj0xq3CuNQrpeuVn3HOzyFCbKyVGpUg97XUexHOPqHF7DGivQVRWw10Mdadm2peLgXNObMG7bnm67D4tWx1xVbF2WUCMJKWiZ5eNDGxvzI0Odc20Hm+jUMBKz8c/HcdBisQwRiL6/DQJHKssxUMpkyjfW/plJkXnJJSL4D5kj2GeOlLvcAAAAASUVORK5CYII=",
    yin: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJhSURBVHgB7ZjbbeJAFIaPDRIgHjYvIPE2VLDZCtZUsNtBkg6SCiCVhHSQVBCnAzrIvCJeiIS4X/If4kjBMxOIPRgrmk+ybB0zzPw+lzk2kcPhcDgcjp+DR0dkMpkEnuf9w6XYbDZn2wk9b4jrR1yGlUpFkiWOIoQF4NTGEez5abdcLt+wOEqJdSGz2ay9Xq873xgicbTSeseqkAQiPpCUUow1IVE4PVFyOGdalBCf7HFH6QjwMC4pIVaERN4QlJ4LSogVISin/8kO7BVBCbAiBOXzN1kCxeKcEnBQskdPid0eUBRC0cbWw+U9veeHIAtMp9PhYrHg/+1hjsdarRYeMu5LIbwbc0nF+ZoyAvPRfD7/bJI4buv1evercUYhkRe4nArKGMxNy+VyxwbvdOCdW9MY3/BHgk4kgkHbwgvfsSEqOoPBoG0aY0p2HiDoRLCIUqmk2FlMv9/XVkgltCJvvFAOGI1GvPi4WSJfmnGj4pEsE3sfxWJRZxYIsSBuVITY3BPSUigUtPbVaqWEly5HBOUfETfYbBozw/f9X4qNcowm0begjXmN23RCniknIBdMt8K4QRECtQ+UA7AOZXf/AJ5S1qgIqVar/CNJJybWb32m22g0ZNxoypErOiHsDXTAih2ekAg3bb+lFYJ35xAnY4N2TFjEeDzW3RriXkvnDcZYtSCmg83xBk8h9TenQ+GcYBGaahXCE39MIpi9L1bce/EnHtTuv3SkzZIFcE5oqlSI437fuwjzrc9BaOLO4SUBUWdkAbwNbhfP4bSzKM+TmKvXbDYziwaHw+FwOBwOh5k3yQwEfzIcVQ0AAAAASUVORK5CYII=",
};

export let getWeatherIcon = (str) => {
    let iconStr = null;
    // 把天气的枚举转化成了所有自己可以显示的有限类
    switch (str) {
        case "晴":
            iconStr = "qing";
            break;
        case "少云":
            iconStr = "qing";
            break;
        case "热":
            iconStr = "qing";
            break;
        case "未知":
            iconStr = "qing";
            break;
        case "平静":
            iconStr = "qing";
            break;
        case "晴间多云":
            iconStr = "duoyun";
            break;
        case "多云":
            iconStr = "duoyun";
            break;
        case "阴":
            iconStr = "yin";
            break;
        case "小雨":
            iconStr = "xiaoyu";
            break;
        case "中雨":
            iconStr = "zhongyu";
            break;
        case "阵雨":
            iconStr = "xiaoyu";
            break;
        case "毛毛雨/细雨":
            iconStr = "xiaoyu";
            break;
        case "雨":
            iconStr = "xiaoyu";
            break;
        case "小雨-中雨":
            iconStr = "xiaoyu";
            break;
        case "冷":
            iconStr = "xiaoyu";
            break;
        case "大雨":
            iconStr = "dayu";
            break;
        case "暴雨":
            iconStr = "dayu";
            break;
        case "大暴雨":
            iconStr = "dayu";
            break;
        case "特大暴雨":
            iconStr = "dayu";
            break;
        case "强阵雨":
            iconStr = "dayu";
            break;
        case "强雷阵雨":
            iconStr = "leiyu";
            break;
        case "极端降雨":
            iconStr = "dayu";
            break;
        case "中雨-大雨":
            iconStr = "zhongyu";
            break;
        case "大雨-暴雨":
            iconStr = "dayu";
            break;
        case "暴雨-大暴雨":
            iconStr = "dayu";
            break;
        case "大暴雨-特大暴雨":
            iconStr = "dayu";
            break;
        case "雷阵雨":
            iconStr = "leiyu";
            break;
        case "雷阵雨并伴有冰雹":
            iconStr = "bingbao";
            break;
        case "雨雪天气":
            iconStr = "yujiaxue";
            break;
        case "雨夹雪":
            iconStr = "yujiaxue";
            break;
        case "阵雨夹雪":
            iconStr = "yujiaxue";
            break;
        case "冻雨":
            iconStr = "yujiaxue";
            break;
        case "雪":
            iconStr = "xiaoxue";
            break;
        case "阵雪":
            iconStr = "xiaoxue";
            break;
        case "小雪":
            iconStr = "xiaoxue";
            break;
        case "中雪":
            iconStr = "zhongxue";
            break;
        case "大雪":
            iconStr = "daxue";
            break;
        case "暴雪":
            iconStr = "daxue";
            break;
        case "小雪-中雪":
            iconStr = "zhongxue";
            break;
        case "中雪-大雪":
            iconStr = "zhongxue";
            break;
        case "大雪-暴雪":
            iconStr = "daxue";
            break;
        case "微风":
            iconStr = "feng";
            break;
        case "和风":
            iconStr = "feng";
            break;
        case "清风":
            iconStr = "feng";
            break;
        case "有风":
            iconStr = "feng";
            break;
        case "强风/劲风":
            iconStr = "feng";
            break;
        case "疾风":
            iconStr = "feng";
            break;
        case "大风":
            iconStr = "feng";
            break;
        case "风暴":
            iconStr = "feng";
            break;
        case "烈风":
            iconStr = "feng";
            break;
        case "狂爆风":
            iconStr = "feng";
            break;
        case "飓风":
            iconStr = "feng";
            break;
        case "热带风暴":
            iconStr = "feng";
            break;
        case "龙卷风":
            iconStr = "feng";
            break;
        case "浮尘":
            iconStr = "wumai";
            break;
        case "扬沙":
            iconStr = "wumai";
            break;
        case "沙尘暴":
            iconStr = "wumai";
            break;
        case "强沙尘暴":
            iconStr = "wumai";
            break;
        case "雾":
            iconStr = "wumai";
            break;
        case "浓雾":
            iconStr = "wumai";
            break;
        case "强浓雾":
            iconStr = "wumai";
            break;
        case "轻雾":
            iconStr = "wumai";
            break;
        case "大雾":
            iconStr = "wumai";
            break;
        case "特强浓雾":
            iconStr = "wumai";
            break;
        case "霾":
            iconStr = "wumai";
            break;
        case "中度霾":
            iconStr = "wumai";
            break;
        case "重度霾":
            iconStr = "wumai";
            break;
        case "严重霾":
            iconStr = "wumai";
            break;
    }
    return icon[iconStr]
}