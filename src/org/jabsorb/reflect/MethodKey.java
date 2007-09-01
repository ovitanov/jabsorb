/*
 * JSON-RPC-Java - a JSON-RPC to Java Bridge with dynamic invocation
 *
 * $Id: MethodKey.java,v 1.2 2006/03/06 12:41:32 mclark Exp $
 *
 * Copyright Metaparadigm Pte. Ltd. 2004.
 * Michael Clark <michael@metaparadigm.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package org.jabsorb.reflect;

/**
 * A key for identifying a method and the number of arguments to that method uniquely.
 */
public class MethodKey {

    private String methodName;

    private int numArgs;

    /**
     * Get the method name.
     * @return the method name.
     */
    public String getMethodName() { return methodName; }

    /**
     * Get the number of arguments that the method takes.
     * @return the number of arguments that the method takes.
     */
    public int getNumArgs() { return numArgs; }

    /**
     * Create a MethodKey for a given method name and the number of arguments that
     * that method takes.
     * @param methodName method name.
     * @param numArgs number of arguments the method takes.
     */
    public MethodKey(String methodName, int numArgs) {
        this.methodName = methodName;
        this.numArgs = numArgs;
    }

    public int hashCode() {
        return methodName.hashCode() * numArgs;
    }

    public boolean equals(Object o) {
        if (!(o instanceof MethodKey))
            return false;
        return (methodName.equals(((MethodKey) o).methodName) && numArgs == ((MethodKey) o).numArgs);
    }

}